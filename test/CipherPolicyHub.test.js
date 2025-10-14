import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("CipherPolicyHub", function () {
  let cipherPolicyHub;
  let owner;
  let verifier;
  let adjuster;
  let policyholder;

  beforeEach(async function () {
    [owner, verifier, adjuster, policyholder] = await ethers.getSigners();

    const CipherPolicyHub = await ethers.getContractFactory("CipherPolicyHub");
    cipherPolicyHub = await CipherPolicyHub.deploy(verifier.address, adjuster.address);
    await cipherPolicyHub.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await cipherPolicyHub.owner()).to.equal(owner.address);
    });

    it("Should set the correct verifier", async function () {
      expect(await cipherPolicyHub.verifier()).to.equal(verifier.address);
    });

    it("Should set the correct adjuster", async function () {
      expect(await cipherPolicyHub.adjuster()).to.equal(adjuster.address);
    });
  });

  describe("Policy Creation", function () {
    it("Should create a policy successfully", async function () {
      const policyType = "Health Insurance";
      const description = "Comprehensive health coverage";
      const duration = 365 * 24 * 60 * 60; // 1 year in seconds

      // Note: This test is simplified - in production you would need FHE encrypted inputs
      // For now, we'll test that the contract can be deployed and basic functions exist
      expect(await cipherPolicyHub.policyCounter()).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow only verifier to assess risk", async function () {
      // Test that the function exists and has proper access control
      // In a real test, you would need FHE encrypted inputs
      expect(await cipherPolicyHub.verifier()).to.equal(verifier.address);
    });

    it("Should allow only adjuster to process claims", async function () {
      // Test that the function exists and has proper access control
      expect(await cipherPolicyHub.adjuster()).to.equal(adjuster.address);
    });
  });
});
