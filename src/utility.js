export function deleteItem(e){
    console.log('delete');
    let element=e.target;
    let id=element.id;
    
    let parentElementId="parent"+id;
    let currentElement=document.getElementById(parentElementId);
    
    currentElement.remove();
}

export function changeContent(e){
    let element=e.target;
    let id=element.id;
    let formid="form"+id;
    let form=document.getElementById(formid);
    let children=form.children;
    let namefield=children[1];
    let description=children[2];


    if(element.value=='Edit'){
        addStyle(form);
        namefield.contentEditable='true';
        description.contentEditable="true"
        element.value="Done"
    }
    else{

        removeStyle(form);
        namefield.contentEditable='false';
        description.contentEditable='false';
        element.value="Edit";
    }
}

export function addStyle(e){
    // e.style.borderBottom="solid";
    e.style.backgroundColor="#ffffff20";
}
export function removeStyle(e){
    // e.style.borderBottom="none";
    e.style.backgroundColor="transparent"
}
