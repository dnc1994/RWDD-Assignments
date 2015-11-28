if (Meteor.isServer) {
    Meteor.startup(function () {
        if (!Sites.findOne()){
            console.log("No websites yet. Creating starter data.");
            Sites.insert({
                title: "Goldsmiths Computing Department",
                url: "http://www.gold.ac.uk/computing/",
                description: "This is where this course was developed.",
                createdOn: new Date(),
                upvotes: 0,
                downvotes: 0
            });
            Sites.insert({
                title: "University of London",
                url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
                description: "University of London International Programme.",
                createdOn: new Date(),
                upvotes: 0,
                downvotes: 0
            });
            Sites.insert({
                title: "Coursera",
                url: "http://www.coursera.org",
                description: "Universal access to the world's best education.",
                createdOn: new Date(),
                upvotes: 0,
                downvotes: 0
            });
            Sites.insert({
                title: "Google",
                url: "http://www.google.com",
                description: "Popular search engine.",
                createdOn: new Date(),
                upvotes: 0,
                downvotes: 0
            });
        }
    });
}
