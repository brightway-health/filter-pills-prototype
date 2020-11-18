var eventHub = new Vue();

var filters = [
    { i: 1, s: true, t: "memory loss", c: "symptoms" },
    { i: 2, s: true, t: "balance", c: "symptoms" },
    { i: 3, s: true, t: "vision", c: "symptoms" },
    { i: 4, s: true, t: "routine", c: "symptoms" },
    { i: 5, s: true, t: "physical", c: "therapy" },
    { i: 6, s: true, t: "emotional", c: "therapy" },
    { i: 7, s: true, t: "occupational", c: "therapy" },
    { i: 8, s: false, t: "recretional", c: "therapy" },
    { i: 9, s: false, t: "mild", c: "injury" },
    { i: 10, s: true, t: "moderate", c: "injury" },
    { i: 11, s: false, t: "severe", c: "injury" },
    { i: 12, s: false, t: "drugs", c: "symptoms" },
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
            console.log('hr');
            this.$actions.toggleFilter(id);
            this.loadFn();
        },
        loadFn: function () {
            eventHub.$emit("load");
        }
    }
});

/**
 * Main app
 */
let app = new Vue({
    el: "#container",
    data: {
        loading: true,
        results: 84,
        showFilters: {
            symptoms: false,
            therapy: false,
            injury: false
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
