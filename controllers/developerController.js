const { Developer, Post } = require("../models");

module.exports = {
  // GET /api/developers
  async getDevelopers(req, res) {
    try {
      const developers = await Developer.find();
      res.json(developers);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch developers", error: err.message });
    }
  },

  // GET /api/developers/:developerId (populate posts + connections)
  async getSingleDeveloper(req, res) {
    try {
      const developer = await Developer.findById(req.params.developerId)
        .populate({
          path: "posts",
          options: { sort: { createdAt: -1 } }, // ✅ newest posts first
        })
        .populate("connections");

      if (!developer) {
        return res
          .status(404)
          .json({ message: "No developer found with that id" });
      }

      res.json(developer);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch developer", error: err.message });
    }
  },

  // POST /api/developers
  async createDeveloper(req, res) {
    try {
      const developer = await Developer.create(req.body);
      res.status(201).json(developer);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to create developer", error: err.message });
    }
  },

  // PUT /api/developers/:developerId
  async updateDeveloper(req, res) {
    try {
      // Only update allowed fields (avoid letting users overwrite posts/connections directly)
      const update = {};
      if (typeof req.body.username === "string") update.username = req.body.username;
      if (typeof req.body.email === "string") update.email = req.body.email;
      if (typeof req.body.headline === "string") update.headline = req.body.headline;
      if (Array.isArray(req.body.skills)) update.skills = req.body.skills;

      const developer = await Developer.findByIdAndUpdate(
        req.params.developerId,
        update,
        { new: true, runValidators: true }
      );

      if (!developer) {
        return res
          .status(404)
          .json({ message: "No developer found with that id" });
      }

      res.json(developer);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to update developer", error: err.message });
    }
  },

  // DELETE /api/developers/:developerId
  async deleteDeveloper(req, res) {
    try {
      const developer = await Developer.findById(req.params.developerId);

      if (!developer) {
        return res
          .status(404)
          .json({ message: "No developer found with that id" });
      }

      // 1) Delete all posts authored by this developer (keeps DB clean)
      await Post.deleteMany({ authorUsername: developer.username });

      // 2) Remove this developer from other developers' connections arrays
      await Developer.updateMany(
        { connections: developer._id },
        { $pull: { connections: developer._id } }
      );

      // 3) Delete developer document
      await Developer.deleteOne({ _id: developer._id });

      res.json({ message: "Developer deleted", developerId: developer._id });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete developer", error: err.message });
    }
  },

  // POST /api/developers/:developerId/connections/:connectionId
  async addConnection(req, res) {
    try {
      // Optional safety: ensure the connection exists
      const connectionExists = await Developer.exists({ _id: req.params.connectionId });
      if (!connectionExists) {
        return res
          .status(404)
          .json({ message: "Connection developer not found" });
      }

      const developer = await Developer.findByIdAndUpdate(
        req.params.developerId,
        { $addToSet: { connections: req.params.connectionId } },
        { new: true }
      ).populate("connections");

      if (!developer) {
        return res
          .status(404)
          .json({ message: "No developer found with that id" });
      }

      res.status(201).json(developer);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Failed to add connection", error: err.message });
    }
  },

  // DELETE /api/developers/:developerId/connections/:connectionId
  async removeConnection(req, res) {
    try {
      const developer = await Developer.findByIdAndUpdate(
        req.params.developerId,
        { $pull: { connections: req.params.connectionId } },
        { new: true }
      ).populate("connections");

      if (!developer) {
        return res
          .status(404)
          .json({ message: "No developer found with that id" });
      }

      res.json(developer);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to remove connection", error: err.message });
    }
  },
};