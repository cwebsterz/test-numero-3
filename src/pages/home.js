import React from 'react'
import Header from '../containers/header'
import {
  Button,
  List,
  ImageListItem,
  SimpleListItem,
  TextField
} from 'jrs-react-components'
import LinkButton from '../components/link-button'
import { connect } from 'react-redux'
import { map, sortBy, compose, prop, filter } from 'ramda'
import {
  SEARCH_TEXT,
  SEARCH_RESULTS,
  CLEAR_SEARCHED_ALBUMS,
  FAVORITES_SEARCH_RESULTS
} from '../constants'

const Home = function(props) {
  function li(albums) {
    console.log('albums: ', albums)
    return (
      <ImageListItem
        rank={albums.rank}
        key={albums.id}
        id={albums.id}
        title={albums.name}
        image={albums.poster}
        link={<LinkButton to={`/show/${albums.id}`}>Details</LinkButton>}
      />
    )
  }

  function sortedAlbums(albumRank) {
    return sortBy(a => Number(prop('rank', a), albumRank))
  }

  return (
    <div>
      <Header />
      <main>

        <div className="mw6 center mt2 tc">
          <form onSubmit={props.handleSubmit}>

            <TextField
              value={props.searchAlbum}
              onChange={props.handleChange}
              optional={false}
              help="Enter Album Name"
            />
            <div className="cf">
              <div className="fc">
                <Button>Search Albums</Button>
              </div>
            </div>
          </form>
        </div>

        <div className="mw6 center mt2 tc">
          <List>
            <SimpleListItem
              title="Add New Favorite"
              link={<LinkButton to="/new">Add</LinkButton>}
            />
            {compose(map(li), sortedAlbums())(props.favorites)}
          </List>
        </div>
      </main>
    </div>
  )
}

const connector = connect(mapStateToProps, mapActionsToProps)

function mapStateToProps(state) {
  console.log('state', state)
  return {
    favorites: state.favorites,
    searchAlbum: state.search.searchAlbum,
    searchResults: state.search.searchResults
  }
}

function searchAlbums(dispatch, getState) {
  const searchAlbum = getState().search.searchAlbum
  const url = process.env.REACT_APP_API + '/favorites/'

  fetch(url + '?q=' + searchAlbum).then(res => res.json()).then(items => {
    if (searchAlbum === '') {
      alert('Input search items.')
      return
    }
    dispatch({ type: FAVORITES_SEARCH_RESULTS, payload: items })
  })
}

function mapActionsToProps(dispatch) {
  return {
    dispatch: dispatch,
    handleSubmit: e => {
      e.preventDefault()
      dispatch(searchAlbums)
    },
    handleChange: e => dispatch({ type: SEARCH_TEXT, payload: e.target.value })
  }
}

export default connector(Home)

function openDocs(e) {
  if (/localhost/.test(window.location.href)) {
    window.location = 'http://localhost:5000'
  } else {
    window.location =
      'https://github.com/jrs-innovation-center/jrscode-react-starter#jrs-react-starter-kit'
  }
}
