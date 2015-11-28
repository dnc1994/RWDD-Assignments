
// Routing

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {
        to: "header"
    });
    this.render('site_list_page', {
        to: "main"
    });
});

Router.route('/sites/:_id', function () {
    this.render('navbar', {
        to: "header"
    });
    this.render('site_detail_page', {
        to: "main",
        data: function() {
            return {
                site: Sites.findOne({_id: this.params._id}),
                comments: Comments.find({site_id: this.params._id})
            }
        }
    });
});

// Account setting

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

// Template helpers

Template.site_list.helpers({
    sites: function() {
        if (Session.get('SearchBy')) {
            cursor = SitesIndex.search(Session.get('SearchBy'));
            return cursor.fetch();
        }
        else {
            return Sites.find({}, {sort: {upvotes: -1}});
        }
    }
});

// Template events

Template.navbar.events({
    'submit .js-search': function(event) {
        console.log('Search triggered.');
        var keyword = event.target.search_input.value;
        console.log('Keyword: '+ keyword);
        Session.set('SearchBy', keyword);
        return false;
    }
});

Template.site_list_item.events({
    'click .js-upvote': function(event) {
        var site_id = this._id;
        console.log('Upvoting site with id ' + site_id);
        Sites.update(
            {_id: site_id},
            {$inc: {upvotes: 1}}
        );
        return false;
    },

    'click .js-downvote': function(event) {
        var site_id = this._id;
        console.log('Downvoting site with id ' + site_id);
        Sites.update(
            {_id: site_id},
            {$inc: {downvotes: 1}}
        );
        return false;
    }
});

Template.site_form.events({
    'click .js-toggle-site-form': function(event) {
        $('#site_form').toggle('show');
    },

    'submit .js-save-site-form': function(event) {
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;

        if (!title || !description) {
            console.log('Auto-complete');
            extractMeta(url, function (error, result) {
                console.log(result);
                if (!title) {
                    title = result.title;
                }
                if (!description) {
                    description = result.description;
                }
                if (Meteor.user()) {
                    console.log('Add new site: ' + url);
                    Sites.insert({
                        title: title,
                        url: url,
                        description: description,
                        createdOn: new Date(),
                        upvotes: 0,
                        downvotes: 0
                    });
                }
            });
        }
        else {
            if (Meteor.user()) {
                console.log('Add new site: ' + url);
                Sites.insert({
                    title: title,
                    url: url,
                    description: description,
                    createdOn: new Date(),
                    upvotes: 0,
                    downvotes: 0
                });
            }
        }

        $('#site_form').toggle('hide');
        return false;
    }
});


Template.comment_form.events({
    'submit .js-save-comment-form': function(event) {
        var comment = event.target.comment.value;
        var site_id = event.target.site_id.value;

        if (Meteor.user()) {
            console.log('Add comment to site: ' + site_id + ', comment: ' + comment);
            console.log(Meteor.user());
            createdDate = new Date();
            Comments.insert({
                site_id: site_id,
                comment: comment,
                createdBy: Meteor.user()._id,
                createdByString: Meteor.user().username,
                createdOn: createdDate,
                createdOnString: createdDate.toISOString().substring(0, 10)
            })
        }

        return false;
    }
});