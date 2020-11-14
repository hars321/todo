import React from 'react';
import './Todo.css';

import Failure from './Failure.js';
import Success from './Success.js';
class Todo extends React.Component{

    constructor(props){
        super(props);
        this.state=({
            data:[],        //stores dom data
            jsonData:[]     //stores json data
        })

        this.editButton = this.editButton.bind(this);
        this.deleteItem=this.deleteItem.bind(this);
        this.displayMessage=this.displayMessage.bind(this);
    }
    
    addStyle=(e)=>{
        // e.style.borderBottom="solid";
        e.style.backgroundColor="#ffffff20";
    }
    removeStyle=(e)=>{
        // e.style.borderBottom="none";
        e.style.backgroundColor="transparent"
    }
    
    deleteItem(e){
        
        //get id of the element to delete
        let element=e.target;
        let id=element.id;
        let data=this.state.data;
        let jsonData=this.state.jsonData;
        let len=jsonData.length;

        //find the element in the array of given id
        for(let i=0;i<len;i++){
            if(jsonData[i].id==id){
                //remove the element from the dom data and json data
                data.splice(i,1);
                jsonData.splice(i,1);
                break;
            }
        }

        //set the new state
        this.setState({
            data:data,
            jsonData:jsonData
        })
    }

    //function to modify current item in the list

    editButton=(e)=>{
        //find id of the selected element
        let element=e.target;
        let id=element.id;
        let formid="form"+id;

        //select item from list with id =formid
        let form=document.getElementById(formid);

        //select elements with name and description
        let children=form.children;
        let name=children[1];
        let description=children[2];

        if(element.value=='Edit'){
            this.addStyle(form);
            name.contentEditable='true';
            description.contentEditable="true"
            element.value="Done"
        }
        else{
            this.removeStyle(form);
            name.contentEditable='false';
            description.contentEditable='false';
            element.value="Edit";
        }
    }



   //function to add data in the 
    addData=()=>{
        //append new element to dom
        let namefield=document.getElementById('newItemName').value;
        let descField=document.getElementById('newItemDescription').value;

        if(namefield.length===0 || descField.length===0){
            //do nothing
        }
        else{
            // add these fields to the parent div
            let parent=document.getElementsByClassName('Todo-Present-Items');
            let parentField=parent[0];
            let childNodes=parentField.children;
            let id=childNodes.length;
            
            let newNode=this.generateFields(id,false,namefield,descField);
            let data=this.state.data;
            
            data.push(newNode);

            let newJsonNode={
                "id": id,
                "name": namefield,
                "description": descField,
                "completed": "false"
            }
            let jsonData=this.state.jsonData
            jsonData.push(newJsonNode);
            
            //update the state
            this.setState({
                data:data,
                jsonData:jsonData
            })
            
            //reset input fields
            document.getElementById('newItemName').value="";
            document.getElementById('newItemDescription').value="";
        }
    }


    //function to push alert message in state
    displayMessage=(alert)=>{
        // displays the alert message 
        this.setState({
            alert
        })
        //remove the 
        setTimeout(()=>{
            this.setState({
                alert:""
            })
        },2000);
    }



    //post json data to the server
    saveData=()=>{
        
        let data=JSON.stringify(this.state.jsonData);
        
        let requestOptions = {
            method: 'POST',
            body:data,
            headers: { 'Content-Type': 'application/json' }
        };

        fetch('http://localhost:4000/items',requestOptions)
        .then(response => response.json())
        .then(data =>{
            //if successfull display success
            let alert=<Success data="Changes Saved"/>
            this.displayMessage(alert);

         }).catch(data=>{
             //if error display failure
            let alert=<Failure data="Server Error"/>
            this.displayMessage(alert);
         })
    }


    //generate item node
    generateFields=(i,completed,name,description)=>{
        var item=
                <div className="Item-parent" key={i} id={"parent"+i} >
                    <form className="Item" id={"form"+i} > 
                        <input type="checkbox" id={"check"+i} value={i} onClick={this.changeCheck}></input> 
                            <h3 id={"name"+i} className="Item-name" contentEditable="false">{name}</h3>
                            <h3 id={"desc"+i} className="Item-description" contentEditable="false">{description}</h3>
                            <div className="Edit-buttons">
                                <input type="button" onClick={this.editButton} id={i} key={"edit"+i} className="Item-Button"value="Edit"></input>
                                <input type="button" onClick={this.deleteItem} id={i} key={i} className="Item-Button"value="Delete"></input>
                            </div>
                    </form>
                </div>

        return item;
    }



    componentDidMount(){
        //fetch the data from the server
        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://localhost:4000/items',requestOptions)
        .then(response => response.json())
        .then(data =>{ 
            let len=data.length;
            var arr=[];
            for(let i=0;i<len;i++){
                let current=data[i];
                let item=this.generateFields(i,current.completed,current.name,current.description);
                arr.push(item);
        }
        (this.setState({ 
            data:arr,
            jsonData:data
        }));
        
        });
    }
    
    render(){
        return(
            <div className="Todo-Parent">
                <div className="Todo-Background">

                    
                    <div className="Todo-Heading"> 
                        <h1>To do List</h1>
                    </div>
    

                    <div className="Todo-Body">


                        <div className="Item">
                            <h3>Status</h3> 
                            <h3>Name</h3> 
                            <h3>Description</h3> 
                            <h3>Edit</h3>
                        </div>
                       


                        <div className="Todo-Present-Items">
                            {this.state.data}
                        </div>

                        
    
                    </div>
    
                
                </div>
                    <div className="Todo-Add-New-Item-Parent">
                        <input type="text" className="Todo-Add-New-Item" id="newItemName" placeholder="Add Name"></input>
                        <input type="text" className="Todo-Add-New-Item" id="newItemDescription" placeholder="Add Description"></input>
                        
                        <div className="Save-Buttons">
                            <input type="button" className="Add-Item Item-Button " value="Add Item" onClick={this.addData}></input>
                            <input type="button" className="Add-Item Item-Button " value="Save Changes" onClick={this.saveData}></input>
                        </div>
                        
                    </div>
                    <div className='alert'>
                        {this.state.alert}
                    </div>
              </div>

        )
    }
}


export default Todo;