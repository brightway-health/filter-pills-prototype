/**
 * Filter list component
 */
var filterListTemplate = '<div class="filter">\
<ul class="selected">\
<li v-for="(filter, i) in list" v-on:click="remove(i)">{{ filter }}</li>\
<li v-on:click="showAdd"><span v-if="list.length === 0">Add Filters </span>+</li>\
</ul>\
<br class="clr" />\
</div>';

var filters = {
  symptomFilters: ["memory loss", "balance", "vision", "routine"],
  typeFilters: ["physical", "emotional", "occupational", "recretional"],
  injuryFilters: ["mild", "moderate", "severe"]
};

var eventHub = new Vue();

Vue.component("filter-list", {
  props: ["filters", "name"],
  data: function () {
    return {
      value: null,
      list: [],
    };
  },
  template: filterListTemplate,
  created: function () {
    eventHub.$on('modal-save', function (e) {
      if (e.name == this.name) {
        this.list = this.list.concat(e.selected)
        this.loadFn()
      }
    }.bind(this))

    eventHub.$on('reset-filters', function () {
      this.list = [...this.filters]
      this.loadFn()
    }.bind(this))

    eventHub.$on('clear-filters', function () {
      this.list = []
      this.loadFn()
    }.bind(this))

    this.list = [...this.filters]
  },
  methods: {
    remove: function (i) {
      this.list.splice(i, 1);
      this.loadFn()
    },
    showAdd: function () {
      eventHub.$emit("modal-open", { name: this.name });
    },
    loadFn: function () {
      this.$emit("load");
    }
  }
});

/**
 * Model component
 */
var modalTemplate = '<div v-show="open" class="modal-wrap">\
<div class="bg" v-on:click="closeModal"></div>\
<div class="modal"><h4>Add Filters</h4>\
<div class="search">Search: <input type="text" v-model="search" /></div>\
<ul class="list"><li v-for="(filter, i) in filters" v-on:click="selectFilter(i)" :class="{ selected: filter.selected }" v-if="search === null || search === \'\' || filter.text.toLowerCase().includes(search.toLowerCase())">{{filter.text}}</li></ul>\
<br class="clr" />\
<div class="btn-wrap">\
<button class="btn save" @click="closeModal">Save</button>\
</div>\
</div>\
</div>';

var possibleFilters = [
  {selected: false, text: "Lorem"},
  {selected: false, text: "ipsum"},
  {selected: false, text: "dolor"},
  {selected: false, text: "sit"},
  {selected: false, text: "amet"},
  {selected: false, text: "consectetur"},
  {selected: false, text: "adipiscing"},
  {selected: false, text: "elit"},
  {selected: false, text: "Vivamus"},
  {selected: false, text: "mattis"},
  {selected: false, text: "lectus"},
  {selected: false, text: "id"},
  {selected: false, text: "auctor"},
  {selected: false, text: "vestibulum"},
  {selected: false, text: "dui"},
  {selected: false, text: "elit"},
  {selected: false, text: "interdum"},
  {selected: false, text: "elit"},
  {selected: false, text: "eu"},
  {selected: false, text: "euismod"},
  {selected: false, text: "quam"},
  {selected: false, text: "mauris"},
  {selected: false, text: "sed"},
  {selected: false, text: "magna"},
  {selected: false, text: "Nulla"},
];

var modalComponent = Vue.component("modal", {
  props: ["filters"],
  template: modalTemplate,
  data: function () {
    return {
      open: false,
      name: null,
      search: null,
    };
  },
  created: function () {
    eventHub.$on("modal-open", this.openModal);
    eventHub.$on("modal-close", this.closeModal);
  },
  methods: {
    openModal: function (e) {
      this.filters = this.filters.map(function (filter) {
        return { ...filter, selected: false };
      })
      this.search = null;
      this.open = true;
      this.name = e.name;
    },
    closeModal: function () {
      this.open = false;
      eventHub.$emit("modal-save", {
        selected: this.filters.filter(function(filter) {
          return filter.selected
        }).map(function (filter) {
          return filter.text;
        }),
        name: this.name,
      })
    },
    selectFilter: function (i) {
      this.filters[i].selected = !this.filters[i].selected;
    },
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
    possibleFilters: possibleFilters,
    filters: filters,
    showFilters: {
      symptoms: false,
      types: false,
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
  },
  methods: {
    load: function () {
      this.loading = true;
      setTimeout(
        function () {
          this.results = Math.floor(Math.random() * 100);
          this.loading = false;
        }.bind(this),
        500
      );
    },
    toggleFilter: function (filterName) {
      this.showFilters[filterName] = !this.showFilters[filterName];
    },
    resetFilters: function () {
      eventHub.$emit('reset-filters')
    },
    clearFilters: function () {
      eventHub.$emit('clear-filters')
    }
  }
});
