import { getGames, getGamesImage, searchGame } from '../services/igdb';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import axios from 'axios';
import { configureToken } from '../services/api';
import styles from '../styles/home.module.scss';

const myLoader = ({ src, width, quality }) => {
  return src
}

export default function Home({ game, games, token }) {
  const [searchData, setSearchData] = useState([]);
  const [gameQuery, setGameQuery] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [imageStyle, setImageStyle] = useState(styles.image);

  useEffect(() => {
    configureToken(token);
    if(typeof window !== 'undefined'){
      localStorage.setItem('token', token);
    }
  },[]);

  const handleFindGame = async() => {
    await searchGame(gameQuery, token).then(response => {
      console.log(response)
      if(response?.data.length > 0){
        setSearchData(response.data)
      }
    });
  }

  const findGame = async (query) => {
    setGameQuery(query);
  }

  const checkChoice = (gameName) => {
    setAttempts(attempts + 1);
    // setSearchData([]);
    if (attempts <= 3) {
      if (gameName === game.name) {
        console.log("mesmoNome");
        setAttempts(0);
        setGameIndex(gameIndex + 1);
      } else {
        console.log("nome diferente");
        console.log("attempts", attempts);
        switch (attempts) {
          case 1:
            setImageStyle(styles.image2);
            break;
          case 2:
            setImageStyle(styles.image3);
            break;
          case 3:
            setImageStyle(styles.image4);
            break;

          default:
            setImageStyle(styles.image);
            break;
        }
      }
    } else {
      return
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Guess Image</h1>
      <p className={styles.description}>Adivinhe qual jogo da imagem abaixo</p>

      <div className={styles.imgContainer}>
        <Image
          className={imageStyle}
          loader={myLoader}
          width={450}
          height={450}
          alt='img'
          src={game.img_url}
        />
      </div>

      <div>
        <div>
          <input
            placeholder='Qual o nome do jogo acima?'
            className={styles.input}
            onChange={e => findGame(e.target.value)}
          />
          <button onClick={handleFindGame}>Procurar</button>
        </div>
        {
          searchData.length > 0 && (
            <ul className={styles.gameList}>
              {
                searchData.map(value => {
                  return (
                    <li key={value.id} className={styles.gameItem} onClick={() => checkChoice(value?.name)}>
                      <span>{value?.name}</span>
                    </li>
                  );
                })
              }
            </ul>
          )
        }
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  let response;
  let gamesData = [];
  let token;

  try {
    response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.SECRET_KEY}&grant_type=client_credentials`
    );

    if(response.data.access_token){
      token = response.data.access_token;
    }
  } catch (error) {
    console.log(error)
  }

  const gameImage = await getGamesImage(token);
  const games = await getGames(gameImage?.data[0]?.game, token).then(response => response.data);

  const game = {
    ...games['0'],
    img_url: `https:${gameImage?.data[0]?.url}`
  }

  return {
    props: {
      game,
      games: gameImage.data,
      token
    }
  }
}
