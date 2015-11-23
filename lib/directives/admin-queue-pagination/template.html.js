export default `

<button
    class="shift"
>First</button>
<button
    class="shift"
>&laquo;</button>
<button
    class="shift"
>&lsaquo;</button>

<span
    class="continued-dots"
>&#8901;&#8901;&#8901;</span>

<button
    class="page"
    ng-repeat="page in pages track by $index"
    ng-class="{'active': currentPage === $index}"
>{{$index + 1}}</button>

<span
    class="continued-dots"
>&#8901;&#8901;&#8901;</span>

<button
    class="shift"
>&rsaquo;</button>
<button
    class="shift"
>&raquo;</button>
<button
    class="shift"
>Last</button>

`;
