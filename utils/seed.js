const mongo = require("../config/connection");
const { Post, Developer } = require("../models"); //no reactionSchema

console.time("🌱 seed");

mongo.once("open", async () => {
  try {
    await mongo.dropDatabase();

    // 1) Seed Developers
    const developers = await Developer.insertMany([
      {
        username: "marc",
        email: "marc@example.com",
        headline: "Builder | Backend + PM",
        skills: ["Node.js", "MongoDB", "Mongoose"],
      },
      {
        username: "alice",
        email: "alice@example.com",
        headline: "Full-stack dev",
        skills: ["JavaScript", "React", "Express"],
      },
      {
        username: "bob",
        email: "bob@example.com",
        headline: "Backend engineer",
        skills: ["APIs", "Databases", "Testing"],
      },
    ]);

    // Quick lookup by username
    const devByUsername = Object.fromEntries(
      developers.map((d) => [d.username, d])
    );

    // 2) Seed Posts (with embedded reactions)
    const postsToCreate = [
      {
        content: "Populate replaces ObjectIds with actual documents.",
        authorUsername: "marc",
        reactions: [
          { reactionBody: "🔥 super clear", username: "alice" },
          { reactionBody: "Nice explanation", username: "bob" },
        ],
      },
      {
        content: "MongoDB stores documents instead of rows.",
        authorUsername: "alice",
        reactions: [{ reactionBody: "Facts 💯", username: "marc" }],
      },
      {
        content: "Virtuals are great for computed fields like counts.",
        authorUsername: "bob",
        reactions: [],
      },
    ];

    const createdPosts = await Post.insertMany(postsToCreate);

    // 3) Link posts to their author Developer (posts = array of ObjectId refs)
    const postIdsByAuthor = createdPosts.reduce((acc, post) => {
      acc[post.authorUsername] ||= [];
      acc[post.authorUsername].push(post._id);
      return acc;
    }, {});

    await Promise.all(
      Object.entries(postIdsByAuthor).map(([username, postIds]) =>
        Developer.updateOne(
          { username },
          { $addToSet: { posts: { $each: postIds } } } // avoids duplicates
        )
      )
    );

    // 4) Seed some connections (Developer -> Developer refs)
    await Developer.updateOne(
      { username: "marc" },
      {
        $addToSet: {
          connections: { $each: [devByUsername.alice._id, devByUsername.bob._id] },
        },
      }
    );

    await Developer.updateOne(
      { username: "alice" },
      { $addToSet: { connections: devByUsername.marc._id } }
    );

    console.log("✅ Seed complete");
    console.timeEnd("🌱 seed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});