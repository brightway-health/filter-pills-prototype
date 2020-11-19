var eventHub = new Vue();

var filters = [
    { i: 1, s: true, t: "memory loss", c: "symptoms" },
    { i: 2, s: true, t: "balance", c: "symptoms" },
    { i: 3, s: true, t: "vision", c: "symptoms" },
    { i: 4, s: true, t: "routine", c: "symptoms" },
    { i: 5, s: true, t: "physical therapy", c: "therapy" },
    { i: 6, s: true, t: "emotional therapy", c: "therapy" },
    { i: 7, s: true, t: "occupational therapy", c: "therapy" },
    { i: 8, s: false, t: "recretional therapy", c: "therapy" },
    { i: 9, s: false, t: "mild", c: "injury" },
    { i: 10, s: true, t: "moderate", c: "injury" },
    { i: 11, s: false, t: "severe", c: "injury" },
    { i: 12, s: false, t: "drugs", c: "symptoms" },
    { i: 13, s: true, t: "survivor", c: "user" },
    { i: 14, s: false, t: "caregiver", c: "user" },
    { i: 15, s: false, t: "medical provider", c: "user" },
    { i: 16, s: false, t: "researcher", c: "user" },
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
 <div class="tags"><a v-for="tag in question.tags" @click="alert(\'Not in Prototype\')">{{tag}}</a></div>\
 </div>\
 <div class="answers"><a class="left" @click="alert(\'Not in Prototype\')">Show 2 answers</a><a class="right" @click="alert(\'Not in Prototype\')">+ Write an answer</a><br class="clr" /></div>\
 </div>\
 <br class="clr" />\
 </div>';

Vue.component('question', {
    props: ['question'],
    template: questionTemplate,
});

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
                }, 0),
                symptoms: filterStore.filters.reduce(reducer('symptoms'), 0),
                therapy: filterStore.filters.reduce(reducer('therapy'), 0),
                injury: filterStore.filters.reduce(reducer('injury'), 0),
                user: filterStore.filters.reduce(reducer('user'), 0),
                years: filterStore.filters.reduce(reducer('years'), 0),
                location: filterStore.filters.reduce(reducer('location'), 0),
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
                console.log(curFilter.s, origFilter.s);

                if (curFilter.s !== origFilter.s) {
                    same = false;
                }
            }

            return same;
        }
    },
    created: function () {
        setTimeout(
            function () {
                this.results = Math.floor(Math.random() * 100);
                this.loading = false;
            }.bind(this),
            500
        );

        eventHub.$on('load', function () {
            this.loading = true;
            setTimeout(
                function () {
                    this.results = Math.floor(Math.random() * 100);
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
        },
        clearFilters: function () {
            this.$actions.clearFilters();
        }
    }
});
