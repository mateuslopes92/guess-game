import axios from 'axios';

const urlGames = "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games/";

export const getGames = async (id, token) => {
  const fields = `fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;where id = ${id};`;
  let response;

  try {
    response = await axios.post(
      process.env.IGDB_BASE_URL,
      fields, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': process.env.CLIENT_ID,
        },
      }
    );
  } catch (error) {
    console.log('getGames error =>', error);
  }

  return response;
}


export const getGamesImage = async (token) => {
  const fields = `fields alpha_channel,animated,checksum,game,height,image_id,url,width;`
  let response;

  try {
    response = await axios.post(
      process.env.IGDB_GAME_URL,
      fields, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': process.env.CLIENT_ID,
        },
      }
    );
  } catch (error) {
    console.log('getGamesImage error =>', error);
  }

  console.log(response.data)

  return response;
}

export const searchGame = async (value, token) => {
  const fields = `fields name, rating; where rating > 88; search "${value}";`;
  let response;

  try {
    response = await axios.post(
      urlGames,
      fields, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID,
        },
      }
    );
  } catch (error) {
    console.log('search error =>', error);
  }

  return response;
}