let db = {
  users: [
    {
      userId: "fghgr578hgffffh876gghj",
      email: "harry@dresden.com",
      username: "harry",
      createdAt: "2020-02-09T17:38:58.173Z",
      imageUrl: "image/gtsfcgfddsfghvghjgh",
      bio: "Stars and stones",
      website: "www.harrydresden.com",
      location: "Chicago, USA"
    }
  ],
  mentions: [
    {
      username: "user",
      body: "body",
      time: "ISOSTRING",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      body: "This is a sample scream",
      mentionId: "jdgdh2h4g668egchjd",
      createdAt: "2020-02-09T17:38:58.173Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true" | "false",
      mentionId: "dheeioijwdjolj2738oi",
      type: "like" | "comment",
      createdAt: "2020-02-09T17:38:58.173Z"
    }
  ]
};
const userDetais = {
  // Redux data
  credentials: {
    userId: "HGGDHHJJJGGHG24664849hj",
    email: "lobos@hump.com",
    username: "lobos",
    createdAt: "2020-02-09T17:38:58.173Z",
    imageUrl: "image/gtsfcgfddsfghvghjgh",
    bio: "Ride bikes",
    website: "lobos.com",
    location: "West, Mars"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "HGGHJJJKKJKJJKLHOIHOIJOI"
    },
    {
      userHandle: "user",
      screamId: "HGGHJJJKKJKJJKLHOIHOIJOI"
    }
  ]
};
