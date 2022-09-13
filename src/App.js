import './App.css';
import  React, { useEffect, useState } from 'react';
import {  withAuthenticator } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify';
import { createPet, deletePet } from './graphql/mutations';
import { listPets } from './graphql/queries';
import { version } from 'react';
import DataGrid from 'react-data-grid';


function App() {
  console.log(version);

  // const cols= [
  //   {field:"name", headerName:"Name"},
  //   {field:"description`", headerName:"Description"},
  //   {field:"petType", headerName:"petType"}
  // ];
  // const rows=[{ name:"sam", description:" description v2", petType:"homoSapien"}];

    const cols =[
      {key:"name", name: "name"},
      {key:"description", name: "description" },
      {key:"petType", name: "petType"},
 
    ]
   
  const [petData, setpetData]= useState([])
  useEffect( () =>{
    const fetchPets= async () => {
      const res= await API.graphql({
        query: listPets})
        return res.data.listPets.items

    }
    fetchPets().then(
      pets=> {
        console.log(pets[0])
        setpetData(pets)}
    );
    
  }, []);
  const  handleSubmit= async (e)=>{
    e.preventDefault()
    try {    
      const {data}= await API.graphql(
        {query:createPet, 
        variables:{
          input:{
            name: e.target.petName.value  ,
            description:e.target.description.value,
            petType: e.target.petType.value
          }
  
        } })
    setpetData((actualLst)=> {
      return [...actualLst, data.createPet]
    })
      } catch (error) {
      console.log(error )
    }
  }
  const handlePetDelete= async (petID)=> {
    const newPetList= petData.filter((pet)=> pet.id!== petID)
    await API.graphql({
      query: deletePet,
      variables:{ 
        input:{id:petID}}
    })
    setpetData(newPetList)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder='enter a name ' name="petName" />
        <input placeholder='Enter a description ' name="description" />
        <select name="petType"  >
          <option value="none" disabled>Please Select A Pet </option>
          <option value="dog" > Dog</option>
          <option value="cat" > Cat</option>
          <option value="giraf" > Girafe</option>
        </select>
        <button> Create Pet</button>
        
      </form>
      <main>
        <ul>
          {petData.map(  (pet) =>(
            <li  onClick={(e)=> handlePetDelete(pet.id)}
            key={pet.id} 
            style={{
              listStyle:"none",
              border: "1px solid black",
              margin:"10px",
              wodth:"200px"
            }}>
              <article>
                <h3>{ pet.name} </h3>
                <h3>{ pet.type} </h3>
                <h3>{ pet.description} </h3>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <div syle={{width:"100%"}}>
      <DataGrid columns={cols} rows={petData} />;

      </div>
    </div>
  );
}

export default withAuthenticator(App);
