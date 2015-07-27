function link(scope, element, attrs) {
    let anchor = element.find('a')[0];
    let input = element.find('input')[0];
    anchor.onclick =  () => input.focus();
}

export default link;
