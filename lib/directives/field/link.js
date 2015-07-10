function link(scope, element, attrs) {
    // let anchor = element.find('a')[0];
    // console.log(anchor);
    // anchor.onclick = () => {
    //     console.log(element.find('input')[0]);
    //     console.log(scope.isSelecting);
    //     scope.isSelecting = true;
    //     scope.$apply();
    //     element.find('input')[0].focus();
    //     //console.log('this is a test');
    // };
    element.bind('click', ()=> {
        element.find('input')[0].focus();
    });
}

export default link;
