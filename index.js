Vue.component('vue-slider', window['vue-slider-component']);
Vue.component('v-autocomplete', window['Autocomplete']);
var defaultLocations = [ { t: 'New York, NY', s: false }, { t: 'New York', s: false } ];
var eventHub = new Vue();

var filters = [
    { i: 1, s: true, d: true, m: true, t: "memory loss", c: "symptoms" },
    { i: 2, s: true, d: true, m: true, t: "balance", c: "symptoms" },
    { i: 3, s: false, t: "vision", c: "symptoms" },
    { i: 4, s: false, t: "routine", c: "symptoms" },
    { i: 5, s: true, d: true, m: true, t: "physical therapy", c: "therapy" },
    { i: 6, s: true, d: true, m: true, t: "occupational therapy", c: "therapy" },
    { i: 7, s: false, t: "emotional therapy", c: "therapy" },
    { i: 8, s: false, t: "recreational therapy", c: "therapy" },
    { i: 17, s: false, t: "employment", c: "symptoms" },
    { i: 18, s: false, t: "emotional control", c: "symptoms" },
    { i: 19, s: false, t: "cognitive therapy", c: "therapy" },
    { i: 20, s: false, t: "medicare", c: "financial" },
    { i: 21, s: false, t: "medicaid", c: "financial" },
    { i: 22, s: false, t: "non profit assistance", c: "financial" },
    { i: 23, s: false, t: "insurance", c: "financial" },
    { i: 24, s: false, t: "out-of-pocket", c: "financial" },
    { i: 25, s: false, t: "billing", c: "financial" },
    { i: 30, s: false, c: "nutrition", t: "omega-3" },
    { i: 31, s: false, c: "nutrition", t: "alcohol" },
    { i: 32, s: false, c: "nutrition", t: "weight loss" },
    { i: 33, s: false, c: "nutrition", t: "strength gain" },
    { i: 34, s: true, d: true, m: true, c: "medications", t: "ibuprofen" },
    { i: 35, s: false, c: "medications", t: "noopept" },
    { i: 36, s: false, c: "medications", t: "modafinal" },
    { i: 37, s: false, c: "medications", t: "l-theanine" },
    { i: 38, s: false, c: "legal", t: "lawsuit" },
    { i: 39, s: false, c: "legal", t: "settlement" },
    { i: 40, s: false, c: "legal", t: "lawyer" },
    { i: 41, s: false, c: "legal", t: "liability" },
    { i: 42, s: false, t: "sex & relationships", c: "symptoms" },
    // User type filters
    { i: 9, u: true, s: false, t: "traumatic brain injury", c: "injury" },
    { i: 10, u: true, s: false, t: "stroke", c: "injury" },
    { i: 11, u: true, s: false, t: "anoxic brain injury", c: "injury" },
    { i: 13, u: true, s: false, t: "survivors", c: "user" },
    { i: 14, u: true, s: false, t: "caregivers", c: "user" },
    { i: 15, u: true, s: false, t: "medical providers", c: "user" },
    { i: 16, u: true, s: false, t: "researchers", c: "user" },
    { i: 26, u: true, s: false, t: "unconscious", c: "recovery" },
    { i: 27, u: true, s: false, t: "minimally conscious", c: "recovery" },
    { i: 28, u: true, s: false, t: "starting to recover", c: "recovery" },
    { i: 43, u: true, s: false, t: "partially recovered", c: "recovery" },
    { i: 44, u: true, s: false, t: "mostly recovered", c: "recovery" },
    { i: 45, u: true, s: false, t: "fully recovered", c: "recovery" },
    { i: 46, u: true, s: false, c: "date", t: "<1 month" },
    { i: 47, u: true, s: false, c: "date", t: "1-3 months" },
    { i: 48, u: true, s: false, c: "date", t: "3-12 months" },
    { i: 49, u: true, s: false, c: "date", t: "1-3 years" },
    { i: 50, u: true, s: false, c: "date", t: "3-5 years" },
    { i: 51, u: true, s: false, c: "date", t: "5-10 years" },
    { i: 52, u: true, s: false, c: "date", t: "10+ years" },
];

var locations = [
    'Austin, TX',
    'Buffalo, NY',
    'Chicago, IL',
    'Dallas, TX',
    'Evanston, IL',
    'Houston, TX',
    'Los Angeles, CA',
    'New York, NY',
    'Minneapolis, MN',
    'Philadelphia, PA',
    'Pittsburgh, PA',
    'Rochester, NY',
    'Sacramento, CA',
    'San Diego, CA',
    'Springfield, IL',
    'St. Paul, MN',
    'California',
    'Illinois',
    'Minnesota',
    'New York',
    'Pennsylvania',
    'Texas',
];

var filterStore = Vue.observable({
    filters: filters.map(function (v) { return { ...v } }),
});

var filterActions = {
    toggleFilter: function (id) {
        for (i in filterStore.filters) {
            var filterId = filterStore.filters[i].i;
            if (filterId === id) {
                filterStore.filters[i].s = !filterStore.filters[i].s;
                filterStore.filters[i].d = true;
            }
        }
    },
    resetFilters: function () {
        filterStore.filters = filters.map(function (v) { return {...v} });
        eventHub.$emit('load');
    },
    clearFilters: function () {
        filterStore.filters = filterStore.filters.map(function (f) {
            return { ...f, s: false };
        });
        eventHub.$emit('load');
    },
};

Vue.prototype.$store = filterStore;
Vue.prototype.$actions = filterActions;

/**
 * Filter list component
 */
var filterListTemplate = '<div class="filter">\
<ul class="selected">\
<li v-for="filter in filters" v-on:click="clickFilter(filter.i)" :class="{ active: filter.s }">{{ filter.t }}</li>\
</ul>\
<br class="clr" />\
</div>';

Vue.component("filter-list", {
    props: ["name", "search"],
    computed: {
        filters: function () {
            return this.$store.filters.filter(function (v) {
                return v.c === this.name && ((typeof this.search === 'string' && this.search !== '' && v.t.toLowerCase().includes(this.search.toLowerCase())) || this.search === '');
            }.bind(this))
        }
    },
    template: filterListTemplate,
    methods: {
        clickFilter: function (id) {
            this.$actions.toggleFilter(id);
            this.loadFn();
        },
        loadFn: function () {
            eventHub.$emit("load");
        }
    }
});

var filterDorpdownTemplate = '<span> \
<a :class="{\'dorpdown-selector\': true, active: visible }" @click="toggleDorp"> \
<span class="dorpdown-selector-title">{{title}}</span><span class="dorpdown-selector-arrow" v-if="!visible">v</span><span class="dorpdown-selector-arrow" v-if="visible">^</span> \
</a> \
<div class="dorpdown-container" v-show="visible"> \
<p class="dorpdown-clear"><a :class="{disabled: !anyActive}" @click="clear">Clear Filters</a></p> \
<a v-for="filter in filters" :class="{\'dorpdown-filter\': true, active: filter.s}" @click="toggleFilter(filter.i)">{{filter.t}}</a> \
<br class="clr" />\
</div> \
</span>';

Vue.component('filter-dorpdown', {
    props: ['name'],
    data: function () {
        return {
            visible: false,
        }
    },
    computed: {
        filters: function () {
            var filters = filterStore.filters.filter((function (filter) {
                return filter.c == this.name;
            }).bind(this));

            return filters;
        },
        anyActive: function () {
            return this.filters.filter(function (filter) {
                return filter.s;
            }).length > 0;
        },
        title: function () {
            if (this.anyActive) {
                var string = this.filters.filter(function (filter) {
                    return filter.s;
                }).map(function (filter) {
                    return filter.t;
                }).join(', ');

                if (string.length > 22) {
                    return string.substring(0, 20) + '...';
                }

                return string;
            } else {
                return 'any';
            }
        }
    },
    template: filterDorpdownTemplate,
    methods: {
        toggleFilter: function (id) {
            this.$actions.toggleFilter(id);
            this.loadFn();
        },
        loadFn: function () {
            eventHub.$emit("load");
        },
        clear: function () {
            if (this.anyActive) {
                for (var filter of this.filters) {
                    if (filter.s) {
                        this.$actions.toggleFilter(filter.i);
                    }
                }
                this.loadFn();
            }
        },
        toggleDorp: function () {
            if (this.visible) {
                eventHub.$emit('close-user-dorps');
                this.visible = false;
            } else {
                this.visible = true;
            }
        }
    },
    created: function () {
        eventHub.$on('close-user-dorps', (function () {
            this.visible = false;
        }).bind(this))
    }
})

/**
 * Question template
 */

 var questions = [
    {
        user: 'derby100',
        votes: 203,
        type: 'caregiver',
        date: 'Oct 28',
        title: 'Can anyone recommend a neurologist with brain injury experience in Chicago?',
        text: "My dad's been dealing with seizures and I think he's on too many meds. The facility he's at won't adjust anything until he sees a neurologist.",
        tags: [ 'neurologists', 'emotional control ' ],
        answers: 2,
        upvotes: 24,
    },
    {
        user: 'kawther81',
        votes: 582,
        type: 'survivor',
        date: 'Oct 26',
        title: 'Anyone have experience with Vielight Neuro for PBM? Is it worth the price?',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin commodo, mi non sodales congue, mauris.',
        tags: [ 'photobiomodulation', ],
        answers: 8,
        upvotes: 36,
    },
    {
        user: 'baseball99',
        votes: 1043,
        type: 'caregiver',
        date: 'Oct 28',
        title: 'Do you know a physical therapist with stroke experience in Los Angeles?',
        text: "My dad's been dealing with seizures and I think he's on too many meds. The facility he's at won't adjust anything until he sees a neurologist.",
        tags: [ 'neurologists', 'chicago ' ],
        answers: 2,
        upvotes: 207,
    },
 ];

 var questionTemplate = '<div class="question-wrap">\
 <div class="upvotes" @click="alert(\'Not in Prototype\')">\
 <img src="like.svg" width="32" />\
 <p class="votes">{{question.upvotes}}</p>\
 </div>\
 <div class="question-right">\
 <div class="question">\
 <div class="details">\
 <div class="left"><a class="question-user" @click="alert(\'Not in Prototype\')">{{question.user}}</a> <span class="question-votes">({{question.votes}} votes)</span><span class="user-type">{{question.type}}</span></div>\
 <div class="right">{{question.date}}<img src="kebab.svg" class="question-kebab" height="14" style="margin-left: 15px" @click="alert(\'Not in Prototype\')" /></div>\
 <br class="clr" /></div>\
 <h2 @click="alert(\'Not in Prototype\')">{{question.title}}</h2>\
 <p class="question-text">{{question.text}}</p>\
 <div class="tags"> \
 <a v-for="tag in question.tags" @click="alert(\'Not in Prototype\')">{{tag}}</a> \
 <a @click="alert(\'Not in Prototype\')" v-if="filters.length > 0">{{filters[Math.floor(Math.random() * filters.length)].t}}</a>\
 </div>\
 </div>\
 <div class="answers"><a class="left" @click="alert(\'Not in Prototype\')">Show 2 answers</a><a class="right" @click="alert(\'Not in Prototype\')">+ Write an answer</a><br class="clr" /></div>\
 </div>\
 <br class="clr" />\
 </div>';

Vue.component('question', {
    props: ['question'],
    template: questionTemplate,
    computed: {
        filters: function () {
            return filterStore.filters.filter(function (filter) { return filter.s });
        }
    }
});

var mainColFilterTemplate = '<span> \
<span v-if="numberSelected === 0" id="viewing-all-q-notice">Viewing all questions</span> \
<span v-if="numberSelected > 0"> \
<a class="pill" v-for="filter of filters" :class="{ active: filter.s }" @click="toggleFilter(filter.i)">{{ filter.t }}</a> \
</span> \
</span>';

Vue.component('main-col-filters', {
    props: ['numberSelected'],
    computed: {
        filters: function () {
            return filterStore.filters.filter(function (filter) {
                return !filter.u && (filter.d || filter.s);
            });
        },
    },
    template: mainColFilterTemplate,
    methods: {
        toggleFilter: function (id) {
            this.$actions.toggleFilter(id);
            this.loadFn();
        },
        loadFn: function () {
            eventHub.$emit("load");
        }
    }
})

/**
 * Main app
 */
let app = new Vue({
    el: "#app",
    data: {
        loading: true,
        results: 84,
        showSidebar: false,
        questions: questions,
        sliderValue: [0, 11],
        locations: defaultLocations.map(function (v) { return { ...v } }),
        showFilters: {
            symptoms: false,
            therapy: false,
            userType: false,
            financial: false,
            nutrition: false,
            medications: false,
            legal: false,
            injury: false,
            user: false,
            date: false,
            location: false,
        },
        locationVisible: false,
        search: '',
        topicsSelected: true,
    },
    computed: {
        hasSearch: function () {
            return this.search != '';
        },
        showTagBasedOnSearch: function () {
            if (typeof this.search !== 'string' || this.search == '') {
                return {
                    symptoms: true,
                    therapy: true,
                    financial: true,
                    nutrition: true,
                    medications: true,
                    legal: true,
                    injury: true,
                    user: true,
                    date: true,
                    location: true,
                };
            } else {
                var filterFn = (function (category) {
                    return (function (filter) {
                        return filter.c === category &&
                            filter.t.toLowerCase().includes(this.search.toLowerCase());
                    }).bind(this);
                }).bind(this);

                const filterLocations = l => {
                    return l.toLowerCase().includes(this.search.toLowerCase());
                }

                return {
                    symptoms: filters.filter(filterFn('symptoms')).length > 0,
                    therapy: filters.filter(filterFn('therapy')).length > 0,
                    financial: filters.filter(filterFn('financial')).length > 0,
                    nutrition: filters.filter(filterFn('nutrition')).length > 0,
                    medications: filters.filter(filterFn('medications')).length > 0,
                    legal: filters.filter(filterFn('legal')).length > 0,
                    injury: filters.filter(filterFn('injury')).length > 0,
                    user: filters.filter(filterFn('user')).length > 0,
                    date: filters.filter(filterFn('date')).length > 0,
                    location: locations.filter(filterLocations).length > 0,
                }
            }
        },
        filteredLocations: function () {
            const filterLocations = l => {
                return l.toLowerCase().includes(this.search.toLowerCase());
            }

            if (typeof this.search === 'string' && this.search !== '') {
                return locations.filter(filterLocations).map( (l) => {
                    const locationInList = this.locations.find(location => location.t === l);
                    return { t: l, s: locationInList && locationInList.s };
                });
            }
            return this.locations;
        },
        filtersSelected: function () {
            var reducer = function (type) {
                return function (total, filter) {
                    if (filter.c === type && filter.s) {
                        return total + 1;
                    }

                    return total;
                }
            }

            return {
                total: filterStore.filters.reduce(function (total, filter) {
                    if (filter.s) {
                        return total + 1;
                    }

                    return total;
                }, 0)
                    + (this.yearsChanged ? 1 : 0)
                    + this.locations.filter(function (l) { return l.s; }).length,
                symptoms: filterStore.filters.reduce(reducer('symptoms'), 0),
                therapy: filterStore.filters.reduce(reducer('therapy'), 0),
                injury: filterStore.filters.reduce(reducer('injury'), 0),
                user: filterStore.filters.reduce(reducer('user'), 0),
                years: filterStore.filters.reduce(reducer('years'), 0),
                location: this.locations.filter(function (l) { return l.s; }).length,
                financial: filterStore.filters.reduce(reducer('financial'), 0),
                recovery: filterStore.filters.reduce(reducer('recovery'), 0),
                nutrition: filterStore.filters.reduce(reducer('nutrition'), 0),
                medications: filterStore.filters.reduce(reducer('medications'), 0),
                legal: filterStore.filters.reduce(reducer('legal'), 0),
            }
        },
        myTagsSelected: function () {
            var same = true;
            for (n in filterStore.filters) {
                var curFilter = filterStore.filters[n];
                var origFilter = filters[n];

                if (curFilter.s && !origFilter.m) {
                    same = false;
                }

                if (!curFilter.s && origFilter.m) {
                    same = false;
                }

                if (curFilter.d !== origFilter.d) {
                    same = false;
                }
            }

            if (this.yearsChanged) {
                same = false;
            }

            for (l in this.locations) {
                var sameL = false;
                var location = this.locations[l];
                for (i in defaultLocations) {
                    var defaultLocation = defaultLocations[i];

                    if (location.t === defaultLocation.t && location.s === defaultLocation.s) {
                        sameL = true;
                    }
                }

                if (sameL === false) {
                    same = false;
                }
            }

            return same;
        },
        locationDorpText: function () {
            var locationFilters = this.locations.filter(function (l) { return l.s });

            if (locationFilters.length > 0) {
                var string = locationFilters.map(function (filter) {
                    return filter.t;
                }).join(', ');

                if (string.length > 22) {
                    return string.substring(0, 20) + '...';
                }

                return string;
            } else {
                return 'any';
            }
        },
        yearsChanged: function () {
            return this.sliderValue[0] != 0 || this.sliderValue[1] != 11;
        },
        userFiltersSentence: function () {
            var filterByType = function (type) {
                return filterStore.filters.filter(function (filter) {
                    return filter.c === type && filter.s;
                }).map(function (filter) {
                    return filter.t;
                });
            }

            var injuryFilters = filterByType('injury');
            var userFilters = filterByType('user');
            var timeFilters = filterByType('date');
            var recoveryFilters = filterByType('recovery');
            var locationFilters = this.locations.filter(function (location) { return location.s }).map(function (location) { return location.t });

            var out = 'Asked by ';
            if (injuryFilters.length > 0) {
                out += injuryFilters.join(', ') + ' ';
            }

            if (userFilters.length > 0) {
                out += userFilters.join(', ') + ' ';
            } else {
                out += 'users ';
            }

            if (locationFilters.length > 0) {
                out += 'located in ' + locationFilters.join(', ') + ' ';
            }

            if (timeFilters.length > 0) {
                out += 'injured in the last ' + timeFilters.join(', ') + ' ';
            }

            if (recoveryFilters.length > 0) {
                out += 'who are now ' + recoveryFilters.join(', ') + ' ';
            }

            return out;
        },
        hasUserFilters: function () {
            return (filterStore.filters.find(function (filter) {
                return filter.u && filter.s;
            }) !== undefined) || (this.locations.find(function (location) {
                return location.s;
            }) !== undefined);
        },
    },
    created: function () {
        setTimeout(
            function () {
                this.results = this.filtersSelected.total !== 0 ? this.filtersSelected.total * 7 : 294,
                this.loading = false;
            }.bind(this),
            500
        );

        eventHub.$on('load', function () {
            this.loading = true;
            setTimeout(
                function () {
                    this.results = this.filtersSelected.total !== 0 ? this.filtersSelected.total * 7 : 294,
                    this.loading = false;
                }.bind(this),
                500
            );
        }.bind(this));
    },
    methods: {
        toggleSidebar: function () {
            this.showSidebar = !this.showSidebar;
        },
        toggleFilter: function (filterName) {
            this.showFilters[filterName] = !this.showFilters[filterName];
        },
        resetFilters: function () {
            this.$actions.resetFilters();
            this.sliderValue = [0, 11];
            this.locations = defaultLocations.map(function (v) { return { ...v } });
        },
        clearFilters: function () {
            this.$actions.clearFilters();
            this.sliderValue = [0, 11];
            this.locations = defaultLocations.map(function (v) { return { ...v } });
        },
        clearLocations: function () {
            this.locations = defaultLocations.map(function (v) { return { ...v } });
            this.loadFn();
        },
        loadFn: function () {
            eventHub.$emit("load");
        },
        locationSearch: function (val) {
            return locations.filter(function (location) {
                return location.toLowerCase().startsWith(val.toLowerCase());
            });
        },
        locationSubmit: function (v) {
            if (v !== '' && typeof v !== 'undefined') {
                this.locations.push({ t: v, s: true });
                this.loadFn();
            }

            this.$refs.locationField.setValue(undefined);
            for (let e of this.$refs.locationField.$el.children[0].children) {
                if (e.tagName === 'INPUT') {
                    e.blur();
                }
            }
            // this.$refs.locationField.$el.children[0].children[0].blur();
        },
        closeUserFilter: function (e) {
            var targetElement = e.target;

            do {
                if (targetElement.className === 'user-filter-dorpdown') {
                    return;
                }
                targetElement = targetElement.parentNode;
            } while(targetElement);

            eventHub.$emit('close-user-dorps');
        },
        toggleLocation: function(l) {
            l.s = !l.s;
            const cl = this.locations.find(loc => loc.t === l.t);
            if (cl) {
                cl.s = false;
                this.locations = this.locations.filter(loc => loc.t !== l.t);
            } else {
                this.locations.push(l);
            }
        },
    }
});

function repositionColumns() {
    var col2 = document.getElementById('col2');
    var placeholder = document.getElementById('col2-placeholder');
    var placeholderRect = placeholder.getBoundingClientRect();

    col2.style.width = placeholderRect.width;
    col2.style.left = placeholderRect.left;
}

document.onreadystatechange = function (e) {
    if (document.readyState === 'complete') {
        repositionColumns();
        // col2.setAttribute('right', placeholder.)
    }
}

window.addEventListener('resize', function () {
    repositionColumns();
});
