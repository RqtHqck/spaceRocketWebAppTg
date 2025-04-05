import React, {useEffect, useState} from 'react';
import {useError} from '../context/ErrorContext.jsx';
import {useDispatch} from 'react-redux';
import "../styles/pages/LeaderBoard.css";
import api from '../utils/api.js';
import CoinDisplay from '../components/CoinsDisplay.jsx';
import LevelDisplay from '../components/LevelDisplay.jsx';


const LeaderBoard = () => {
  const {showError} = useError();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('level');
  const [isLoading, setIsLoading] = useState(true);


  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/users/sorted`);
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        showError(error.status, error.code);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };



  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Лидеры</h2>
      </div>

      {isLoading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="users-list">
          {users.map((user, index) => (
            <div key={user._id} className="user-card">
              <div className="user-rank">#{index + 1}</div>
              <img
                src={user.imageUrl || '/icons/profile.png'}
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{user.userName}</span>
                <span className="user-level">{user.game.level}</span>
              </div>        

              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-value">{Math.round(user.game.exp)} exp</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value small-coin">
                    <CoinDisplay coinsAmount={user.game.coins} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


export default LeaderBoard;
