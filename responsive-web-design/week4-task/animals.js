var categories_template, animals_template, animal_template;
var current_category = animals.class[0];
var current_animal = current_category.animals[0];

function renderTemplate(template, data) {
    var html = template(data);
    $('#content').html(html);
}

$(document).ready(function() {
    var source;

    source = $('#categories-template').html();
    categories_template = Handlebars.compile(source);
    source = $('#animals-template').html();
    animals_template = Handlebars.compile(source);
    source = $('#animal-template').html();
    animal_template = Handlebars.compile(source);

    $('#categories-tab').click(function() {
        renderTemplate(categories_template, animals);
        $('.nav-tabs .active').removeClass('active');
        $('#categories-tab').addClass('active');

        $(".category-thumbnail").click(function() {
            var index = $(this).data("id");
            current_category = animals.class[index];
            renderTemplate(animals_template, current_category);

            $('.animal-thumbnail').click(function() {
                var index = $(this).data("id");
                current_animal = current_category.animals[index];
                renderTemplate(animal_template, current_animal);
            });
        });
    });

    $('#animals-tab').click(function() {
        renderTemplate(animals_template, current_category);

        $('.nav-tabs .active').removeClass('active');
        $('#animals-tabs').addClass('active');

        $('.animal-thumbnail').click(function() {
            var index = $(this).data("id");
            current_animal = current_category.animals[index];
            renderTemplate(animal_template, current_animal);
        });
    });

    $('#categories-tab').click();
});