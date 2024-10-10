import * as assert from "assert";
import * as vscode from "vscode";

import {
  cstringFormat,
  getAccuracy,
  getIncrementedNumber,
  multiply,
  add,
} from "../extension";

suite("Increment Extension Test Suite", () => {
  vscode.window.showInformationMessage("Running Increment extension tests");

  test("getAccuracy", () => {
    assert.strictEqual(0, getAccuracy(1));
    assert.strictEqual(0, getAccuracy(1.0));
    assert.strictEqual(1, getAccuracy(1.1));
    assert.strictEqual(1, getAccuracy(1.9));
    assert.strictEqual(2, getAccuracy(1.01));
    assert.strictEqual(2, getAccuracy(1.99));
  });

  test("multiply", () => {
    assert.strictEqual(0, multiply(1, 0));
    assert.strictEqual(2, multiply(1, 2));
    assert.strictEqual(2, multiply(1.0, 2));
    assert.strictEqual(2, multiply(1, 2.0));
    assert.strictEqual(2, multiply(1.0, 2.0));
    assert.strictEqual(2.2, multiply(1.1, 2));
    assert.strictEqual(2.2, multiply(1, 2.2));
    assert.strictEqual(2.2, multiply(1.1, 2.0));
    assert.strictEqual(2.2, multiply(1.0, 2.2));
    assert.strictEqual(2.4, multiply(1.1, 2.2));
  });

  test("add", () => {
    assert.strictEqual(1, add(1, 0));
    assert.strictEqual(3, add(1, 2));
    assert.strictEqual(3, add(1.0, 2));
    assert.strictEqual(3, add(1, 2.0));
    assert.strictEqual(3, add(1.0, 2.0));
    assert.strictEqual(3.1, add(1.1, 2));
    assert.strictEqual(3.1, add(1, 2.1));
    assert.strictEqual(3.1, add(1.1, 2.0));
    assert.strictEqual(3.1, add(1.0, 2.1));
    assert.strictEqual(3.3, add(1.1, 2.2));
  });

  test("cstringFormat", () => {
    assert.strictEqual("1", cstringFormat("%d", 1));
    assert.strictEqual("1", cstringFormat("%d", 1.0));
    assert.strictEqual("1.1", cstringFormat("%f", 1.1));
    assert.strictEqual("1.1", cstringFormat("%f", 1.1));
    assert.strictEqual("1.1", cstringFormat("%.1f", 1.1));
    assert.strictEqual("0x01", cstringFormat("0x%02x", 1));
    assert.strictEqual("0x0a", cstringFormat("0x%02x", 10));
  });

  test("getIncrementedNumber", () => {
    assert.strictEqual(0, getIncrementedNumber(0, 1, 0));
    assert.strictEqual(1, getIncrementedNumber(0, 1, 1));
    assert.strictEqual(2, getIncrementedNumber(0, 1, 2));
    assert.strictEqual(1, getIncrementedNumber(1, 1, 0));
    assert.strictEqual(2, getIncrementedNumber(1, 1, 1));
    assert.strictEqual(0.1, getIncrementedNumber(0, 0.1, 1));
  });
});
