const template = `

<summary ng-click="toggleDropdown()">

    <span class="filter-count">
        Viewing: ({{ plays.length }})
    </span>

    <span class="dropdown-title">
        Filter Plays
        <i class="icon icon-chevron-down"></i>
    </span>
</summary>

<ul>
    <li
        ng-repeat="tag in selectedTags"
        class="selected-tag"
    >
        {{ tag.name }}
        <i
            class="icon icon-x"
            ng-click="removeTag(tag)"
        ></i>
    </li>
    <li
        ng-if="selectedTags.length > 0"
        ng-click="clearTags()"
        class="clear-tags"
    >Clear</li>
</ul>

<section ng-if="showDropdown">
    <input
        class="plays-filter-search"
        placeholder="Search tags"
        ng-model="searchQuery"
    />
    <plays-filter
        ng-repeat="tag in tags | filter:searchQuery"
        name="{{tag.name}}"
        ng-click="selectTag(tag)"
        ng-class="{ selected: selectedTags.indexOf(tag) != -1 }"
    ></plays-filter>
</section>

`;

export default template;
