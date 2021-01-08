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
    { i: 8, s: false, t: "recretional therapy", c: "therapy" },
    { i: 9, s: false, t: "traumatic brain injury", c: "injury" },
    { i: 10, s: false, t: "stroke", c: "injury" },
    { i: 11, s: false, t: "anoxic brain injury", c: "injury" },
    { i: 13, s: false, t: "survivor", c: "user" },
    { i: 14, s: false, t: "caregiver", c: "user" },
    { i: 15, s: false, t: "medical provider", c: "user" },
    { i: 16, s: false, t: "researcher", c: "user" },
    { i: 17, s: false, t: "employment", c: "symptoms" },
    { i: 18, s: false, t: "emotional control", c: "symptoms" },
    { i: 19, s: false, t: "cognitive therapy", c: "therapy" },
    { i: 20, s: false, t: "medicare", c: "financial" },
    { i: 21, s: false, t: "medicaid", c: "financial" },
    { i: 22, s: false, t: "non profit assistance", c: "financial" },
    { i: 23, s: false, t: "insurance", c: "financial" },
    { i: 24, s: false, t: "out-of-pocket", c: "financial" },
    { i: 25, s: false, t: "billing", c: "financial" },
    { i: 26, s: false, t: "unconscious", c: "recovery" },
    { i: 27, s: false, t: "minimally conscious", c: "recovery" },
    { i: 28, s: false, t: "starting to recovery", c: "recovery" },
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
    { i: 43, s: false, t: "partially recovered", c: "recovery" },
    { i: 44, s: false, t: "mostly recovered", c: "recovery" },
    { i: 45, s: false, t: "fully recovered", c: "recovery" },
];

var locations = [
    'Austin, TX',
    'Buffalo, NY',
    'Chicago, IL',
    'Dallas, TX',
    'Evanston, IL',
    'Houston, TX',
    'Los Angeles, CA',
    // 'New York, NY',
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
    // 'New York',
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

        for (i in filters) {
            var filterId = filters[i].i;
            if (filterId === id) {
                filters[i].d = true;
            }
        }
    },
    resetFilters: function () {
        filterStore.filters = filters.map(function (v) { return {...v} });
        eventHub.$emit('load');
    },
    clearFilters: function () {
        filterStore.filters = filters.map(function (f) {
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
    props: ["name"],
    computed: {
        filters: function () {
            return this.$store.filters.filter(function (v) {
                return v.c === this.name;
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
        tags: [ 'neurologists', 'chicago ' ],
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
    data: {
        filters,
    },
    computed: {
        filters: function () {
            return filterStore.filters.filter(function (filter) {
                return filter.d || filter.s;
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
    el: "#container",
    data: {
        loading: true,
        results: 84,
        showSidebar: false,
        showMoreFilters: false,
        questions: questions,
        sliderValue: [0, 11],
        locations: defaultLocations.map(function (v) { return { ...v } }),
        showFilters: {
            symptoms: false,
            therapy: false,
            injury: false,
            user: false,
            years: false,
            location: false,
            financial: false,
            recovery: false,
            nutrition: false,
            medications: false,
            legal: false,
        }
    },
    computed: {
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
        yearsChanged: function () {
            return this.sliderValue[0] != 0 || this.sliderValue[1] != 11;
        }
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
