import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import "../styles/pages/RewardPage.css";
import {useDispatch} from 'react-redux';

import { setCoins } from '../redux/coinsSlice.jsx';
import { setLevel } from '../redux/levelSlice.jsx';
import { useError } from '../context/ErrorContext.jsx';


const RewardPage = () => {
  const [rewards, setRewards] = useState([]);
  const [userRewards, setUserRewards] = useState([]);
  const [game, setGame] = useState(1); // по умолчанию 1

  const userId = sessionStorage.getItem("userId");
  const dispatch = useDispatch();

  const fetchRewards = async () => {
    try {
      const rewardsResposnse = await api.get('/rewards');
      setRewards(rewardsResposnse.data);
    } catch (error) {
    }
  };

  const fetchUserRewards = async () => {
    try {
      const userRewardsResposnse = await api.get(`/game/rewards/${userId}`);
      setUserRewards(userRewardsResposnse.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchUserRewards();
  }, []);

  return (
    <div className="reward-page-container">
      <h2>Награды</h2>
      <div className="reward-list">
        {rewards.map(reward => (
          <div key={reward._id} className="reward-card">
            <div className="reward-icon">{reward.icon}</div>
            <div className="reward-info">
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
              <small>+{reward.coinsAwarded} монет</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardPage;
