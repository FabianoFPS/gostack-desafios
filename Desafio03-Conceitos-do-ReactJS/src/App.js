import React, { useState, useEffect } from "react";

import "./styles.css";

import api from './services/api'

function App() {
  const resouce = 'repositories';
  const [projects, setProjects] = useState([]);

  useEffect(getProjects, []);

  function getProjects() {
    api.get(resouce)
      .then((response => setProjects(response.data)))
      .catch((reject => console.log(reject)));
  }

  async function handleAddRepository() {
    const response = await api.post(resouce, {
      title: `Novo Projeto de novo ${Date.now()}`,
	    url: "http://eu.br",
	    techs: ["nodejs", "rest"]
    });

    setProjects([...projects, response.data]);
  }

  async function handleRemoveRepository(id) {
    // 204
    api.delete(`${resouce}/${id}`)
      .then((response => {
        if(response.status === 204) {
          const index = projects.findIndex((project) => project.id === id)
          if(!!~index){
            projects.splice(index, 1);
            setProjects([...projects]);
          }
        }
      }))
      .catch((reject => console.log(reject)));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {projects.map( project => {
          return(
            <li key={project.id}>
              { project.title }
              <button onClick={() => handleRemoveRepository(project.id)}>
                Remover
              </button>
            </li>)
        })}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}
export default App;
