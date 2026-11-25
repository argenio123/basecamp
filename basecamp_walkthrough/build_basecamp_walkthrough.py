import bpy
import math
import os
from mathutils import Vector


OUTPUT_DIR = r"C:\code\project_september_2026_to_present\basecamp\basecamp_walkthrough"
BLEND_PATH = os.path.join(OUTPUT_DIR, "basecamp_walkthrough.blend")
PREVIEW_PATH = os.path.join(OUTPUT_DIR, "basecamp_walkthrough_preview.png")
INTERIOR_PREVIEW_PATH = os.path.join(OUTPUT_DIR, "basecamp_walkthrough_interior_ultra.png")

# Architectural dimensions from the supplied A-03/A-04 sheets (metres).
WIDTH = 18.5
DEPTH = 34.085
GROUND_FFL = 0.45
SECOND_FFL = 4.45
TOP_BEAM = 8.40
ROOF_APEX = 9.10
HALF_W = WIDTH / 2


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        pass


def mat(name, color, metallic=0.0, roughness=0.5, transmission=0.0, alpha=1.0, emission=None):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*color, alpha)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    elif "Transmission" in bsdf.inputs:
        bsdf.inputs["Transmission"].default_value = transmission
    bsdf.inputs["Alpha"].default_value = alpha
    if emission:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
            bsdf.inputs["Emission Strength"].default_value = 2.0
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (*emission, 1.0)
    if alpha < 1.0:
        if hasattr(m, "surface_render_method"):
            m.surface_render_method = "DITHERED"
        elif hasattr(m, "blend_method"):
            m.blend_method = "BLEND"
        if hasattr(m, "use_transparency_overlap"):
            m.use_transparency_overlap = False
    return m


def ensure_collection(name):
    collection = bpy.data.collections.get(name)
    if not collection:
        collection = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(collection)
    return collection


def move_to_collection(obj, collection_name):
    collection = ensure_collection(collection_name)
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    collection.objects.link(obj)


def box(name, location, scale, material, collection="Architecture", bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    if bevel > 0:
        mod = obj.modifiers.new("Soft edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    move_to_collection(obj, collection)
    return obj


def cylinder(name, location, radius, depth, material, collection="Architecture", vertices=24, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    move_to_collection(obj, collection)
    return obj


def sphere(name, location, radius, material, collection="Landscape"):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    move_to_collection(obj, collection)
    return obj


def wall_x(name, x1, x2, y, z0, height, material, thickness=0.15, collection="Interior"):
    return box(name, ((x1+x2)/2, y, z0+height/2), (abs(x2-x1), thickness, height), material, collection, 0.025)


def wall_y(name, x, y1, y2, z0, height, material, thickness=0.15, collection="Interior"):
    return box(name, (x, (y1+y2)/2, z0+height/2), (thickness, abs(y2-y1), height), material, collection, 0.025)


def panel_wall_x(prefix, y, x1, x2, z0, z1, panel_width=1.25, glass_mat=None, frame_mat=None):
    width = x2 - x1
    count = max(1, round(width / panel_width))
    step = width / count
    for i in range(count):
        xa = x1 + i * step
        xb = xa + step
        box(f"{prefix}_glass_{i:02d}", ((xa+xb)/2, y, (z0+z1)/2), (step-0.09, 0.055, z1-z0), glass_mat, "Glass", 0.01)
        box(f"{prefix}_mullion_{i:02d}", (xa, y-0.015, (z0+z1)/2), (0.075, 0.12, z1-z0+0.12), frame_mat, "Facade")
    box(f"{prefix}_mullion_end", (x2, y-0.015, (z0+z1)/2), (0.075, 0.12, z1-z0+0.12), frame_mat, "Facade")
    for z in (z0, SECOND_FFL, z1):
        if z0 <= z <= z1:
            box(f"{prefix}_rail_{z:.2f}", ((x1+x2)/2, y-0.015, z), (width+0.08, 0.12, 0.10), frame_mat, "Facade")


def panel_wall_y(prefix, x, y1, y2, z0, z1, panel_width=1.25, glass_mat=None, frame_mat=None):
    length = y2 - y1
    count = max(1, round(length / panel_width))
    step = length / count
    for i in range(count):
        ya = y1 + i * step
        yb = ya + step
        box(f"{prefix}_glass_{i:02d}", (x, (ya+yb)/2, (z0+z1)/2), (0.055, step-0.09, z1-z0), glass_mat, "Glass", 0.01)
        box(f"{prefix}_mullion_{i:02d}", (x+0.015, ya, (z0+z1)/2), (0.12, 0.075, z1-z0+0.12), frame_mat, "Facade")
    box(f"{prefix}_mullion_end", (x+0.015, y2, (z0+z1)/2), (0.12, 0.075, z1-z0+0.12), frame_mat, "Facade")
    for z in (z0, SECOND_FFL, z1):
        if z0 <= z <= z1:
            box(f"{prefix}_rail_{z:.2f}", (x+0.015, (y1+y2)/2, z), (0.12, length+0.08, 0.10), frame_mat, "Facade")


def text_obj(name, body, location, size, material, rotation=(0, 0, 0), extrude=0.02, align="CENTER", collection="Signage"):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = body
    curve.align_x = align
    curve.align_y = "CENTER"
    curve.size = size
    curve.extrude = extrude
    curve.bevel_depth = 0.006
    obj = bpy.data.objects.new(name, curve)
    ensure_collection(collection).objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation
    obj.data.materials.append(material)
    return obj


def add_tree(name, x, y, scale, trunk_mat, leaf_mat):
    cylinder(f"{name}_trunk", (x, y, scale*1.15), scale*0.16, scale*2.3, trunk_mat, "Landscape", 12)
    sphere(f"{name}_crown1", (x, y, scale*2.65), scale*0.8, leaf_mat)
    sphere(f"{name}_crown2", (x+scale*0.45, y, scale*2.45), scale*0.55, leaf_mat)
    sphere(f"{name}_crown3", (x-scale*0.4, y+scale*0.15, scale*2.45), scale*0.55, leaf_mat)


def add_stair(name, x0, y0, z0, width, run, rise, steps, direction=1):
    for i in range(steps):
        tread = run / steps
        h = rise * (i+1) / steps
        y = y0 + direction * (i+0.5) * tread
        box(f"{name}_{i+1:02d}", (x0, y, z0+h/2), (width, tread, h), concrete, "Stairs", 0.012)


def add_treadmill(name, x, y, rot=0):
    base = box(name+"_base", (x, y, GROUND_FFL+0.16), (0.75, 1.8, 0.18), dark, "Equipment", 0.08, (0, 0, rot))
    box(name+"_console", (x, y+0.62, GROUND_FFL+1.15), (0.65, 0.18, 0.5), dark, "Equipment", 0.06, (0, 0, rot))
    return base


def add_table_set(name, x, y, z, top_mat, seat_mat, rotation=0.0):
    cylinder(name+"_pedestal", (x, y, z+0.38), 0.09, 0.76, dark, "Furniture", 20)
    cylinder(name+"_top", (x, y, z+0.78), 0.72, 0.10, top_mat, "Furniture", 32)
    for i, angle in enumerate((0, math.pi/2, math.pi, math.pi*1.5)):
        cx = x + math.cos(angle+rotation)*1.05
        cy = y + math.sin(angle+rotation)*1.05
        cylinder(f"{name}_chair_{i}_leg", (cx, cy, z+0.30), 0.07, 0.60, dark, "Furniture", 16)
        box(f"{name}_chair_{i}_seat", (cx, cy, z+0.63), (0.58, 0.58, 0.12), seat_mat, "Furniture", 0.10, (0, 0, angle+rotation))
        box(f"{name}_chair_{i}_back", (cx+math.cos(angle+rotation)*0.23, cy+math.sin(angle+rotation)*0.23, z+1.03), (0.55, 0.12, 0.75), seat_mat, "Furniture", 0.10, (0, 0, angle+rotation))


def add_locker_bank(name, x, y, z, columns, facing="Y"):
    for i in range(columns):
        offset = (i-(columns-1)/2)*0.48
        loc = (x+offset, y, z+0.95) if facing == "Y" else (x, y+offset, z+0.95)
        dims = (0.44, 0.42, 1.9) if facing == "Y" else (0.42, 0.44, 1.9)
        box(f"{name}_{i+1}", loc, dims, wood, "Furniture", 0.025)
        handle_loc = (loc[0]+0.14, loc[1]-0.225, z+0.95) if facing == "Y" else (loc[0]-0.225, loc[1]+0.14, z+0.95)
        box(f"{name}_{i+1}_handle", handle_loc, (0.025, 0.025, 0.25), gold, "Furniture", 0.008)


def add_treatment_bed(name, x, y, z, rotation=0.0):
    box(name+"_base", (x, y, z+0.38), (0.65, 1.65, 0.70), dark, "Furniture", 0.12, (0, 0, rotation))
    box(name+"_cushion", (x, y, z+0.80), (0.82, 2.05, 0.18), white, "Furniture", 0.12, (0, 0, rotation))
    box(name+"_head", (x, y+0.85, z+0.95), (0.78, 0.45, 0.16), accent, "Furniture", 0.10, (math.radians(-12), 0, rotation))


def add_ceiling_panel(name, x, y, z, sx=1.2, sy=0.45):
    box(name, (x, y, z), (sx, sy, 0.055), light_panel, "LightingFixtures", 0.025)


def add_weight_rack(name, x, y, z):
    box(name+"_frame", (x, y, z+1.1), (1.8, 0.28, 2.2), dark, "Equipment", 0.04)
    for i, radius in enumerate((0.36, 0.31, 0.26, 0.21)):
        cylinder(f"{name}_plate_L_{i}", (x-0.62+i*0.10, y-0.22, z+0.45+i*0.42), radius, 0.08, accent, "Equipment", 32, (math.radians(90), 0, 0))
        cylinder(f"{name}_plate_R_{i}", (x+0.62-i*0.10, y-0.22, z+0.45+i*0.42), radius, 0.08, dark, "Equipment", 32, (math.radians(90), 0, 0))


def keyframe_walkthrough(camera, target):
    points = [
        (1, (23.0, -28.0, 15.0), (0.0, 9.0, 4.0)),
        (70, (8.0, -13.0, 5.5), (0.0, 3.5, 2.6)),
        (135, (0.0, -4.0, 2.2), (0.0, 7.0, 2.0)),
        (205, (1.5, 5.0, 2.1), (0.0, 13.0, 2.0)),
        (275, (3.5, 15.5, 2.3), (0.0, 25.0, 2.5)),
        (345, (0.0, 23.5, 2.5), (0.0, 31.0, 3.2)),
        (415, (-4.5, 4.0, 6.2), (0.0, 13.0, 5.9)),
        (500, (-24.0, 15.0, 14.0), (0.0, 16.0, 4.5)),
    ]
    for frame, cam_loc, target_loc in points:
        camera.location = cam_loc
        target.location = target_loc
        camera.keyframe_insert(data_path="location", frame=frame)
        target.keyframe_insert(data_path="location", frame=frame)
    # Blender 5.3 stores layered animation data outside the legacy Action.fcurves
    # collection. The default Bezier interpolation is already appropriate here.


clear_scene()
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Materials
white = mat("Warm White", (0.86, 0.85, 0.80), roughness=0.72)
interior_white = mat("Interior White", (0.93, 0.92, 0.88), roughness=0.78)
dark = mat("Graphite Steel", (0.035, 0.045, 0.055), metallic=0.72, roughness=0.26)
glass = mat("Blue Grey Glass", (0.08, 0.20, 0.28), metallic=0.05, roughness=0.16, transmission=0.55, alpha=0.34)
wood = mat("Wood Cladding", (0.34, 0.13, 0.045), roughness=0.38)
concrete = mat("Concrete", (0.44, 0.45, 0.46), roughness=0.82)
floor_mat = mat("Polished Floor", (0.28, 0.29, 0.30), metallic=0.08, roughness=0.32)
second_floor_mat = mat("Second Floor", (0.62, 0.60, 0.55), roughness=0.55)
roof_mat = mat("Galvanized Roof", (0.12, 0.13, 0.14), metallic=0.65, roughness=0.28)
green = mat("Landscape Green", (0.08, 0.25, 0.08), roughness=0.9)
leaf = mat("Foliage", (0.035, 0.19, 0.055), roughness=0.86)
trunk = mat("Tree Trunk", (0.18, 0.07, 0.025), roughness=0.95)
asphalt = mat("Asphalt", (0.055, 0.06, 0.065), roughness=0.93)
walkway = mat("Walkway", (0.30, 0.31, 0.31), roughness=0.78)
accent = mat("Basecamp Accent", (0.76, 0.28, 0.055), metallic=0.05, roughness=0.42)
gold = mat("Signage", (0.94, 0.66, 0.14), metallic=0.42, roughness=0.26, emission=(0.35, 0.16, 0.02))
rubber = mat("Gym Rubber", (0.025, 0.028, 0.03), roughness=0.84)
blue = mat("Yoga Blue", (0.05, 0.20, 0.35), roughness=0.72)
ceramic = mat("Ceramic", (0.82, 0.84, 0.82), roughness=0.22)
pool_water = mat("Pool Water", (0.015, 0.22, 0.30), roughness=0.08, transmission=0.35, alpha=0.78)
upholstery = mat("Upholstery", (0.18, 0.075, 0.035), roughness=0.52)
light_panel = mat("Architectural Light", (1.0, 0.82, 0.58), roughness=0.20, emission=(1.0, 0.54, 0.22))

# Subtle procedural surface breakup for close interior shots.
for surface_mat, noise_scale, bump_strength in ((wood, 5.0, 0.18), (concrete, 8.0, 0.12), (floor_mat, 14.0, 0.08)):
    nodes = surface_mat.node_tree.nodes
    links = surface_mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    noise = nodes.get("Detail Noise") or nodes.new("ShaderNodeTexNoise")
    noise.name = "Detail Noise"
    noise.inputs["Scale"].default_value = noise_scale
    noise.inputs["Detail"].default_value = 3.0
    bump = nodes.get("Detail Bump") or nodes.new("ShaderNodeBump")
    bump.name = "Detail Bump"
    bump.inputs["Strength"].default_value = bump_strength
    bump.inputs["Distance"].default_value = 0.08
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# Site and slabs
box("Site Grass", (0, DEPTH/2, -0.18), (50, 55, 0.35), green, "Site")
box("Service Road", (0, -5.5, 0.02), (42, 8.0, 0.16), asphalt, "Site")
box("Front Walk", (0, -0.55, 0.18), (22.0, 2.2, 0.25), walkway, "Site")
box("Ground Floor Slab", (0, DEPTH/2, GROUND_FFL-0.14), (WIDTH, DEPTH, 0.28), floor_mat, "Structure", 0.03)
box("Second Floor Slab", (0, 9.5425, SECOND_FFL-0.13), (WIDTH, 19.085, 0.26), second_floor_mat, "Structure", 0.02)
box("Front Porch", (0, -1.25, GROUND_FFL-0.08), (6.8, 2.5, 0.22), concrete, "Structure", 0.03)

# Primary exterior glazed skin and frame.
panel_wall_x("FrontFacade", -0.03, -HALF_W, HALF_W, GROUND_FFL, TOP_BEAM, 1.32, glass, dark)
panel_wall_y("RightFacade", HALF_W+0.03, 0.0, 19.585, GROUND_FFL, TOP_BEAM, 1.30, glass, dark)
panel_wall_y("LeftGlassUpper", -HALF_W-0.03, 0.0, 19.585, SECOND_FFL, TOP_BEAM, 1.30, glass, dark)

# Opaque lower side/rear masses and wood feature wall.
wall_y("Left Lower Wall", -HALF_W, 0.0, 19.585, GROUND_FFL, SECOND_FFL-GROUND_FFL, white, 0.24, "Facade")
wall_y("Left Rear Wall", -HALF_W, 19.585, DEPTH, GROUND_FFL, TOP_BEAM-GROUND_FFL, white, 0.24, "Facade")
wall_x("Rear Wall", -HALF_W, HALF_W, DEPTH, GROUND_FFL, TOP_BEAM-GROUND_FFL, white, 0.24, "Facade")
box("Wood Feature Wall", (-4.6, -0.19, 2.45), (5.0, 0.24, 4.0), wood, "Facade", 0.03)

# Roof: two low-slope overlapping masses matching A-06.
box("Roof 1", (0, 9.9, 8.58), (19.4, 20.2, 0.28), roof_mat, "Roof", 0.04, (math.radians(0.8), 0, 0))
box("Roof 2", (0, 27.0, 8.70), (19.4, 15.15, 0.28), roof_mat, "Roof", 0.04, (math.radians(-0.8), 0, 0))
box("Roof Front Fascia", (0, -0.18, 8.72), (19.5, 0.32, 0.72), dark, "Roof", 0.025)

# Structural columns at documented grids.
x_grids = [-9.25, -3.25, 3.565, 9.25]
y_grids = [0.0, 6.585, 14.96, 19.085, 24.335, 28.835, 34.085]
for xi, x in enumerate(x_grids):
    for yi, y in enumerate(y_grids):
        if (y <= 19.085) or (x in (-9.25, 9.25)) or y in (24.335, 34.085):
            box(f"Column_{xi}_{yi}", (x, y, (GROUND_FFL+TOP_BEAM)/2), (0.32, 0.32, TOP_BEAM-GROUND_FFL), dark, "Structure", 0.025)

# Ground-floor partitions: room zoning derived from A-03.
wall_y("GF_Yoga_Lobby", -3.25, 0.0, 6.585, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Lobby_Stair", 3.565, 0.0, 6.585, GROUND_FFL, 3.0, interior_white)
wall_x("GF_FrontZone_Back", -HALF_W, HALF_W, 6.585, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Cafeteria", -6.8, 6.585, 14.96, GROUND_FFL, 3.0, interior_white)
wall_x("GF_Fitness_Back", -HALF_W, HALF_W, 14.96, GROUND_FFL, 3.0, interior_white)
wall_x("GF_Restroom_Back", -HALF_W, HALF_W, 19.085, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Restroom_Left", -6.8, 14.96, 19.085, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Restroom_Center", 0.0, 14.96, 19.085, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Office_Block", 6.2, 14.96, 24.335, GROUND_FFL, 3.0, interior_white)
wall_x("GF_Service_Line", -HALF_W, HALF_W, 24.335, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Back_Service", -3.25, 28.835, DEPTH, GROUND_FFL, 3.0, interior_white)
wall_x("GF_Back_Service_Front", -HALF_W, -3.25, 28.835, GROUND_FFL, 3.0, interior_white)
wall_y("GF_Mech_Elec", -6.1, 28.835, DEPTH, GROUND_FFL, 3.0, interior_white)
wall_x("GF_Elec_Storage", -6.1, -3.25, 31.5, GROUND_FFL, 3.0, interior_white)

# Second-floor partitions and spa/wellness core.
z2 = SECOND_FFL
wall_x("SF_Front_Back", -HALF_W, HALF_W, 6.585, z2, 2.95, interior_white)
wall_y("SF_Treatment_Lobby", -3.25, 0.0, 6.585, z2, 2.95, interior_white)
wall_y("SF_Lobby_Hyperbaric", 4.0, 0.0, 6.585, z2, 2.95, interior_white)
wall_y("SF_Left_Wellness", -2.3, 6.585, 19.085, z2, 2.95, interior_white)
wall_y("SF_Right_Wellness", 2.3, 6.585, 19.085, z2, 2.95, interior_white)
wall_x("SF_Shower_Front", -2.3, 2.3, 8.7, z2, 2.95, interior_white)
wall_x("SF_Shower_Back", -2.3, 2.3, 15.9, z2, 2.95, interior_white)
wall_x("SF_Mechanical", -HALF_W, HALF_W, 19.085, z2, 2.95, interior_white)

# Entrance doors and frames.
for x in (-0.52, 0.52):
    box(f"Main Door {x}", (x, -0.18, 1.7), (0.98, 0.07, 2.45), glass, "Doors", 0.02)
    box(f"Main Door Handle {x}", (x + (-0.18 if x < 0 else 0.18), -0.27, 1.65), (0.025, 0.025, 0.75), gold, "Doors", 0.01)
box("Entrance Header", (0, -0.22, 3.15), (3.9, 0.20, 0.16), dark, "Doors", 0.02)

# Ground-to-second stair and porch steps/ramp.
add_stair("MainStair", 6.2, 0.35, GROUND_FFL, 2.5, 5.2, SECOND_FFL-GROUND_FFL, 16, direction=1)
for i in range(4):
    box(f"Porch Step {i+1}", (0, -2.15-i*0.28, 0.06+i*0.09), (6.7, 0.55, 0.12+i*0.06), concrete, "Stairs", 0.015)
box("Accessibility Ramp", (7.1, -2.5, 0.20), (3.6, 1.4, 0.18), concrete, "Stairs", 0.02, (0, math.radians(-4.0), 0))

# Interior equipment and furniture placeholders.
for i in range(6):
    box(f"Yoga Mat {i+1}", (-7.4 + (i%2)*2.6, 1.4 + (i//2)*1.55, GROUND_FFL+0.025), (1.0, 2.0, 0.05), blue, "Equipment", 0.05)
box("Reception Desk", (0.5, 3.6, GROUND_FFL+0.55), (2.5, 0.75, 1.1), wood, "Furniture", 0.12)
box("Lobby Sofa", (-1.8, 2.0, GROUND_FFL+0.42), (2.0, 0.8, 0.84), accent, "Furniture", 0.16)
box("Cafe Counter", (-8.0, 10.7, GROUND_FFL+0.55), (1.6, 5.4, 1.1), wood, "Furniture", 0.10)
for i in range(5):
    add_treadmill(f"Treadmill {i+1}", 6.7, 7.6+i*1.25)
for x in (-4.0, -1.0, 2.0):
    for y in (8.3, 11.3):
        box(f"Gym Bench {x}_{y}", (x, y, GROUND_FFL+0.28), (1.8, 0.65, 0.55), dark, "Equipment", 0.12)
for x in (-5.5, -1.8, 1.8, 5.5):
    for y in (26.2, 30.3):
        box(f"Crossfit Rig {x}_{y}", (x, y, GROUND_FFL+1.5), (0.12, 2.2, 3.0), dark, "Equipment", 0.02)
for x in (-6.0, 6.0):
    for y in (9.0, 13.0):
        box(f"Spa Plunge {x}_{y}", (x, y, SECOND_FFL+0.45), (2.2, 3.0, 0.9), blue, "Furniture", 0.18)

# Detailed café seating, millwork and display.
for i, (x, y) in enumerate(((-8.0, 7.7), (-8.0, 10.1), (-8.0, 12.6))):
    add_table_set(f"Cafe_Set_{i+1}", x, y, GROUND_FFL, wood, upholstery, math.radians(45))
box("Cafe Back Bar", (-8.55, 10.75, GROUND_FFL+1.25), (0.65, 6.2, 2.5), wood, "Furniture", 0.08)
for i in range(4):
    box(f"Cafe Shelf {i+1}", (-8.15, 8.5+i*1.35, GROUND_FFL+1.55), (0.55, 1.0, 0.08), gold, "Furniture", 0.02)

# Reception: layered desk, feature fins and lounge seating.
box("Reception Desk Stone", (0.5, 3.55, GROUND_FFL+0.62), (3.1, 0.92, 1.24), ceramic, "Furniture", 0.14)
box("Reception Desk Wood", (0.1, 3.05, GROUND_FFL+0.46), (2.4, 0.35, 0.92), wood, "Furniture", 0.09)
for i in range(9):
    box(f"Reception Feature Fin {i+1}", (-2.65+i*0.62, 5.95, GROUND_FFL+1.55), (0.08, 0.22, 3.05), wood, "Furniture", 0.02)
for i, x in enumerate((-2.3, -1.15, 1.55, 2.7)):
    box(f"Lobby Chair {i+1}", (x, 1.65, GROUND_FFL+0.44), (0.92, 0.92, 0.82), upholstery, "Furniture", 0.18)
box("Lobby Coffee Table", (0.2, 1.7, GROUND_FFL+0.28), (1.65, 0.72, 0.42), wood, "Furniture", 0.15)

# Locker rooms, washroom fixtures and shower partitions.
add_locker_bank("Women Lockers", -5.5, 18.7, GROUND_FFL, 6, "Y")
add_locker_bank("Men Lockers", 3.4, 18.7, GROUND_FFL, 6, "Y")
for i, x in enumerate((-5.8, -4.7, -3.6, 1.0, 2.1, 3.2)):
    cylinder(f"Toilet Bowl {i+1}", (x, 15.75, GROUND_FFL+0.36), 0.30, 0.48, ceramic, "Plumbing", 32)
    box(f"Toilet Tank {i+1}", (x, 15.98, GROUND_FFL+0.72), (0.55, 0.24, 0.62), ceramic, "Plumbing", 0.08)
for i, x in enumerate((-5.7, -4.3, -2.9, 1.5, 2.9, 4.3)):
    cylinder(f"Basin {i+1}", (x, 18.45, GROUND_FFL+0.86), 0.30, 0.16, ceramic, "Plumbing", 32)
    box(f"Mirror {i+1}", (x, 18.78, GROUND_FFL+1.62), (0.75, 0.035, 0.95), glass, "Plumbing", 0.02)
for i, x in enumerate((-2.4, -1.2, 0.0, 1.2, 2.4)):
    box(f"Shower Divider {i+1}", (x, 17.0, GROUND_FFL+1.15), (0.035, 1.5, 2.30), glass, "Plumbing", 0.01)
    cylinder(f"Shower Head {i+1}", (x+0.42, 17.55, GROUND_FFL+2.05), 0.11, 0.08, dark, "Plumbing", 20, (math.radians(90), 0, 0))

# Expanded fitness equipment and free-weight zone.
add_weight_rack("Weight Rack Left", -4.7, 13.2, GROUND_FFL)
add_weight_rack("Weight Rack Right", -1.7, 13.2, GROUND_FFL)
for i, x in enumerate((-4.8, -2.4, 0.0, 2.4)):
    box(f"Dumbbell Bench {i+1}", (x, 9.4, GROUND_FFL+0.38), (0.72, 2.0, 0.32), upholstery, "Equipment", 0.10)
    cylinder(f"Barbell {i+1}", (x, 10.5, GROUND_FFL+0.62), 0.055, 2.1, dark, "Equipment", 20, (0, math.radians(90), 0))
for i, (x, y) in enumerate(((-5.2, 7.7), (-2.5, 7.7), (0.2, 7.7), (2.9, 7.7))):
    box(f"Cable Machine {i+1}", (x, y, GROUND_FFL+1.2), (1.15, 0.95, 2.4), dark, "Equipment", 0.10)
    box(f"Cable Screen {i+1}", (x, y-0.5, GROUND_FFL+1.45), (0.55, 0.08, 0.48), blue, "Equipment", 0.04)

# CrossFit rigs with connecting bars, lifting platforms and plyo boxes.
for y in (26.2, 30.3):
    box(f"Crossfit Top Rail {y}", (0, y, GROUND_FFL+2.95), (12.0, 0.10, 0.10), dark, "Equipment", 0.02)
for i, (x, y) in enumerate(((-4.5, 25.0), (-1.5, 25.0), (1.5, 25.0), (4.5, 25.0), (-3.0, 29.0), (0, 29.0), (3.0, 29.0))):
    box(f"Lifting Platform {i+1}", (x, y, GROUND_FFL+0.06), (2.4, 2.4, 0.12), wood, "Equipment", 0.04)
    box(f"Plyo Box {i+1}", (x, y, GROUND_FFL+0.42), (0.72, 0.72, 0.84), accent, "Equipment", 0.06)

# Second-floor spa: plunge pools, sauna benches, lockers and treatment rooms.
for i, (x, y) in enumerate(((-6.0, 9.0), (-6.0, 13.0), (6.0, 9.0), (6.0, 13.0))):
    box(f"Plunge Pool Shell {i+1}", (x, y, SECOND_FFL+0.46), (2.45, 3.25, 0.92), ceramic, "Spa", 0.15)
    box(f"Plunge Pool Water {i+1}", (x, y, SECOND_FFL+0.91), (2.12, 2.92, 0.06), pool_water, "Spa", 0.03)
for side, x in (("Women", -7.4), ("Men", 7.4)):
    for i in range(3):
        box(f"{side} Sauna Bench {i+1}", (x, 16.2+i*0.72, SECOND_FFL+0.38+i*0.22), (2.6, 0.58, 0.28), wood, "Spa", 0.05)
    add_locker_bank(f"{side} Spa Lockers", x, 7.1, SECOND_FFL, 5, "Y")
for i, (x, y) in enumerate(((-7.6, 2.0), (-5.2, 2.0), (-7.6, 4.7), (-5.2, 4.7))):
    add_treatment_bed(f"Treatment Bed {i+1}", x, y, SECOND_FFL)
for i, (x, y) in enumerate(((0.0, 3.2), (6.1, 3.5))):
    cylinder(f"Hyperbaric Capsule {i+1}", (x, y, SECOND_FFL+0.95), 0.72, 2.6, ceramic, "Spa", 48, (0, math.radians(90), 0))
    sphere(f"Capsule Window {i+1}", (x, y-0.72, SECOND_FFL+0.95), 0.35, glass, "Spa")

# Architectural ceiling panels and warm interior lighting fixtures.
for floor_z, y_limit in ((3.38, 33.0), (7.38, 18.0)):
    for xi, x in enumerate((-6.5, -3.2, 0.0, 3.2, 6.5)):
        y = 2.2
        yi = 0
        while y <= y_limit:
            add_ceiling_panel(f"CeilingPanel_{floor_z}_{xi}_{yi}", x, y, floor_z)
            y += 3.2
            yi += 1

# Room labels aid navigation in the editable file.
labels = [
    ("YOGA", (-6.2, 3.0, GROUND_FFL+0.02)), ("LOBBY", (0.0, 3.0, GROUND_FFL+0.02)),
    ("FITNESS GYM", (0.0, 10.5, GROUND_FFL+0.02)), ("RESTROOMS", (0.0, 17.1, GROUND_FFL+0.02)),
    ("CROSSFIT", (0.0, 29.5, GROUND_FFL+0.02)), ("WELLNESS", (-6.0, 12.0, SECOND_FFL+0.02)),
    ("WELLNESS", (6.0, 12.0, SECOND_FFL+0.02)), ("SECOND FLOOR LOBBY", (0.0, 3.2, SECOND_FFL+0.02)),
]
for i, (body, loc) in enumerate(labels):
    text_obj(f"RoomLabel_{i}", body, loc, 0.42, dark, (0, 0, 0), 0.006, "CENTER", "Labels")

# Exterior signage.
text_obj("Basecamp Sign", "BASECAMP", (0, -0.34, 5.75), 1.0, gold, (math.radians(90), 0, 0), 0.06)
text_obj("Camsur Sign", "CAMSUR WELLNESS + GYM", (0, -0.35, 4.95), 0.28, white, (math.radians(90), 0, 0), 0.03)

# Parking, planting strip, and trees.
for i in range(10):
    x = -13.5 + i*3.0
    box(f"Parking Stripe {i}", (x, -6.0, 0.12), (0.09, 5.2, 0.025), white, "Site")
box("Front Planter", (0, -2.35, 0.35), (17.8, 0.75, 0.55), concrete, "Landscape", 0.08)
for i in range(11):
    sphere(f"Front Shrub {i}", (-8.0+i*1.6, -2.35, 0.75), 0.55, leaf, "Landscape")
for i, (x, y, s) in enumerate([
    (-12, -1, 1.4), (12, -1, 1.5), (-12, 8, 1.4), (12, 8, 1.4),
    (-12, 17, 1.5), (12, 17, 1.4), (-12, 27, 1.5), (12, 27, 1.5),
    (-12, 36, 1.4), (12, 36, 1.5)
]):
    add_tree(f"Tree {i+1}", x, y, s, trunk, leaf)

# Lights.
bpy.ops.object.light_add(type="SUN", location=(5, -10, 18))
sun = bpy.context.object
sun.name = "Tropical Sun"
sun.data.energy = 2.2
sun.data.angle = math.radians(18)
sun.rotation_euler = (math.radians(32), math.radians(-22), math.radians(28))
move_to_collection(sun, "Lighting")
for i, (loc, energy, size) in enumerate([
    ((0, 5, 7.8), 1200, 8.0), ((0, 16, 7.8), 1500, 8.0), ((0, 28, 7.8), 1800, 9.0),
    ((0, 3, 3.6), 900, 5.0), ((0, 11, 3.6), 1200, 6.0), ((0, 22, 3.6), 1200, 6.0),
]):
    bpy.ops.object.light_add(type="AREA", location=loc)
    light = bpy.context.object
    light.name = f"Interior Area {i+1}"
    light.data.energy = energy
    light.data.shape = "RECTANGLE"
    light.data.size = size
    light.data.size_y = size
    move_to_collection(light, "Lighting")

# Additional warm pools of light for realistic interior depth.
for i, loc in enumerate((
    (-6.0, 3.0, 3.0), (0.0, 3.0, 3.0), (5.8, 4.0, 3.0),
    (-4.0, 10.5, 3.0), (3.8, 10.5, 3.0), (0.0, 18.0, 3.0),
    (-4.0, 27.0, 5.8), (4.0, 29.5, 5.8),
    (-6.0, 3.0, 7.0), (0.0, 3.0, 7.0), (6.0, 3.0, 7.0),
    (-6.0, 12.0, 7.0), (0.0, 12.0, 7.0), (6.0, 12.0, 7.0),
)):
    bpy.ops.object.light_add(type="POINT", location=loc)
    point = bpy.context.object
    point.name = f"Warm Interior Light {i+1}"
    point.data.energy = 420 if loc[2] < 4 else 520
    point.data.color = (1.0, 0.62, 0.36)
    point.data.shadow_soft_size = 1.4
    move_to_collection(point, "Lighting")

bpy.ops.object.light_add(type="AREA", location=(0, -8.0, 10.0), rotation=(math.radians(35), 0, 0))
front_fill = bpy.context.object
front_fill.name = "Exterior Architectural Fill"
front_fill.data.energy = 1800
front_fill.data.shape = "RECTANGLE"
front_fill.data.size = 12.0
front_fill.data.size_y = 8.0
front_fill.data.color = (0.68, 0.80, 1.0)
move_to_collection(front_fill, "Lighting")

# Camera and animated walkthrough.
bpy.ops.object.camera_add(location=(23.0, -28.0, 15.0))
camera = bpy.context.object
camera.name = "Walkthrough Camera"
camera.data.lens = 26
camera.data.sensor_width = 36
move_to_collection(camera, "Walkthrough")
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 9, 4))
target = bpy.context.object
target.name = "Walkthrough Focus"
move_to_collection(target, "Walkthrough")
constraint = camera.constraints.new(type="TRACK_TO")
constraint.target = target
constraint.track_axis = "TRACK_NEGATIVE_Z"
constraint.up_axis = "UP_Y"
keyframe_walkthrough(camera, target)

# Dedicated non-animated camera for the interior verification render.
bpy.ops.object.camera_add(location=(-5.5, 8.0, 2.65))
interior_camera = bpy.context.object
interior_camera.name = "Interior Preview Camera"
interior_camera.data.lens = 22
interior_camera.data.sensor_width = 36
move_to_collection(interior_camera, "Walkthrough")
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(2.0, 13.2, 1.95))
interior_target = bpy.context.object
interior_target.name = "Interior Preview Focus"
move_to_collection(interior_target, "Walkthrough")
interior_constraint = interior_camera.constraints.new(type="TRACK_TO")
interior_constraint.target = interior_target
interior_constraint.track_axis = "TRACK_NEGATIVE_Z"
interior_constraint.up_axis = "UP_Y"

scene = bpy.context.scene
scene.camera = camera
scene.frame_start = 1
scene.frame_end = 500
scene.frame_set(1)
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = PREVIEW_PATH
scene.render.film_transparent = False
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "16"
if hasattr(scene, "eevee"):
    for attr in ("taa_samples", "taa_render_samples"):
        if hasattr(scene.eevee, attr):
            setattr(scene.eevee, attr, 128)
    if hasattr(scene.eevee, "use_raytracing"):
        scene.eevee.use_raytracing = True
    if hasattr(scene.eevee, "use_gtao"):
        scene.eevee.use_gtao = True
        scene.eevee.gtao_distance = 4
        scene.eevee.gtao_factor = 1.35
try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except (TypeError, ValueError):
    pass
scene.world.color = (0.035, 0.055, 0.085)
if scene.world.use_nodes:
    bg = scene.world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.055, 0.095, 0.16, 1)
    bg.inputs["Strength"].default_value = 0.45

# Unit and metadata setup.
scene.unit_settings.system = "METRIC"
scene.unit_settings.length_unit = "METERS"
scene.unit_settings.scale_length = 1.0
scene["source_pdf"] = "UPDATED BASECAMP CAMSUR DESIGN 8.22.2025.pdf"
scene["design_width_m"] = WIDTH
scene["design_grid_depth_m"] = DEPTH
scene["ground_ffl_m"] = GROUND_FFL
scene["second_floor_ffl_m"] = SECOND_FFL
scene["top_of_beam_m"] = TOP_BEAM
scene["roof_apex_m"] = ROOF_APEX
scene["walkthrough_notes"] = "500-frame animated camera: exterior, entrance, lobby, fitness, CrossFit, second floor, side exterior."
scene["interior_upgrade"] = "Detailed reception, cafe, gym, lockers, plumbing, CrossFit, spa, treatment, ceiling fixtures and architectural lighting."
scene["render_profile"] = "Ultra 1920x1080 16-bit PNG, high-quality EEVEE with conditional ray tracing and 128-sample AA."

# Save first, render exterior and interior verification stills, and save again.
bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
scene.frame_set(1)
scene.render.filepath = PREVIEW_PATH
bpy.ops.render.render(write_still=True)
scene.frame_set(205)
scene.camera = interior_camera
scene.render.filepath = INTERIOR_PREVIEW_PATH
bpy.ops.render.render(write_still=True)
scene.frame_set(1)
scene.camera = camera
scene.render.filepath = PREVIEW_PATH
bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
print(f"BASECAMP_BUILD_COMPLETE::{BLEND_PATH}::{PREVIEW_PATH}::{INTERIOR_PREVIEW_PATH}")
