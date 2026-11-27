#!/usr/bin/env node
// Prints one ADMIN_USERS entry (`email:s1.<salt>.<key>`) for a staff member. No dependencies.
//
//   node scripts/hash-admin-password.mjs staff@example.com            # prompts for the password twice (hidden)
//   node scripts/hash-admin-password.mjs staff@example.com < pw.txt   # reads the password from stdin (first line)
//
// The password is never taken as a command-line argument (it would land in shell history).
// Same hash format as src/lib/auth/password.ts and member passwords: scrypt N=16384, r=8, p=1, 16-byte salt, 64-byte key.
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";

const MIN_LENGTH = 12;
const fail = (message) => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email || process.argv.length > 3) fail("Usage: node scripts/hash-admin-password.mjs <staff-email>");
if (email.length > 254 || !/^[^\s@:,;]+@[^\s@:,;]+$/.test(email)) fail(`Not a usable email: ${email}`);

/** Hidden prompt on a terminal; otherwise the first line of stdin. */
function ask(question) {
  return new Promise((resolve) => {
    const tty = process.stdin.isTTY;
    const rl = createInterface({ input: process.stdin, output: process.stderr, terminal: tty });
    if (tty) {
      process.stderr.write(question);
      // Echo nothing while typing: readline writes through _writeToOutput.
      rl._writeToOutput = () => {};
    }
    rl.once("line", (line) => {
      if (tty) process.stderr.write("\n");
      resolve(line); // before close(), which emits "close" synchronously
      rl.close();
    });
    rl.once("close", () => resolve(""));
  });
}

let password;
if (process.stdin.isTTY) {
  password = await ask(`Password for ${email}: `);
  const again = await ask("Repeat the password: ");
  if (password !== again) fail("The passwords don't match.");
} else {
  password = (await ask("")).replace(/\r$/, "");
}
if (password.length < MIN_LENGTH) fail(`Use at least ${MIN_LENGTH} characters (a long passphrase is best).`);
if (password.length > 512) fail("Use at most 512 characters.");

const salt = randomBytes(16);
const key = await new Promise((resolve, reject) => scrypt(password, salt, 64, (error, derived) => (error ? reject(error) : resolve(derived))));
process.stdout.write(`${email}:s1.${salt.toString("base64url")}.${key.toString("base64url")}\n`);
process.stderr.write("Add this line to ADMIN_USERS (comma-separated for several staff), then redeploy/restart.\n");
