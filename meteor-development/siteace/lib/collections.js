Sites = new Mongo.Collection('sites');
Comments = new Mongo.Collection('comments');

SitesIndex = new EasySearch.Index({
    collection: Sites,
    fields: ['title', 'description'],
    engine: new EasySearch.Minimongo()
});
