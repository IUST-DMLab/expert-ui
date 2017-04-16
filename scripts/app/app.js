var app = angular.module('expertApp', ['ngRoute', 'ui.bootstrap', 'bw.paging']);

app
    .filter('mapPrefix', function () {
        return function (link) {
            var prefixes = {
                'dboeni': 'http://mappings.dbpedia.org/server/mappings/en/Infobox_',
                'wkmen': 'http://en.wikipedia.org/wiki/Mapping_en',
                'dbr': 'http://dbpedia.org/resource/',
                'dbo': 'http://dbpedia.org/ontology/',
                'rr': 'http://www.w3.org/ns/r2rml#',
                'rml': 'http://semweb.mmlab.be/ns/rml#',
                'ql': 'http://semweb.mmlab.be/ns/ql#',
                'rdf': 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
                'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
                'skos': 'http://www.w3.org/2004/02/skos/core#',
                'foaf': 'http://xmlns.com/foaf/0.1/',
                'purl': 'http://purl.org/dc/elements/1.1/',
                'purlt': 'http://purl.org/dc/terms/',
                'owl': 'http://www.w3.org/2002/07/owl#',
                'geo': 'http://www.w3.org/2003/01/geo/',
                'dbpe': 'http://en.wikipedia.org/property/',
                'dbp': 'http://fa.wikipedia.org/property/',
                'wikifa': 'http://fa.wikipedia.org/wiki/',
                'wikien': 'http://en.wikipedia.org/wiki/',
                'fkg': 'http://fkg.iust.ac.ir/ontology/',
                'wt': 'http://fa.wikipedia.org/wiki/template/'
            };

            for (var x in prefixes) {
                var p = prefixes[x];
                if (link.indexOf(p) !== -1)
                    return x + ':' + link.replace(p, '');
            }

            return link;

        }
    });

var OUC = {
    isEmpty: function (obj) {
        return obj == undefined || obj == null;
    }
};