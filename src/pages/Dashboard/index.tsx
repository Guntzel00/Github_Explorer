import React, { useState, FormEvent } from 'react';

import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';
import explorer_logo from '../../assets/explorer_logo.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Please enter a repository name');
      return;
    }

    try {
      const response = await api.get(`search/repositories?q=${newRepo}`);
      const numberOfResults = response.data.total_count;
      setRepositories([]);
      setNewRepo('');

      if (numberOfResults <= 0) {
        setInputError('No results found');
        return;
      }
      setRepositories(response.data.items);
      setInputError('');
    } catch (err) {
      setInputError('Something went wrong, please try again later');
    }
  }

  return (
    <>
      <img src={explorer_logo} alt="Github explorer" />
      <Title>Explore Github Repositories</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          onChange={(e) => setNewRepo(e.target.value)}
          type="text"
          placeholder="Type the repository name"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
