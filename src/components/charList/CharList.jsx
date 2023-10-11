import './charList.scss';
import MarvelService from '../../services/MarvelService';
import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

class CharList extends Component{

  marvelService = new MarvelService();
  
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 200
  }

  componentDidMount() {
    this.onRequest()
  }

  onRequest(offset){
    this.onCharListLoading()
    this.marvelService.getAllCharacters(offset)
    .then(this.onCharListLoaded)
    .catch(this.onError)
  }

  onCharListLoading() {
    this.setState({
      newItemsLoading: true
    })
  }

  onCharListLoaded = (newCharList) => {
  this.setState(({offset , charList}) => ({
    charList: [...charList, ...newCharList],
    loading: false,
    newItemsLoading: false,
    offset: offset + 9
  }));
}


  onError = () => {
    this.setState({
      error: true,
      loading: false
    })
  }

  renderItems = (arr) => {
    const items = arr.map((item) => {
      let imgStyle = {'objectFit' : 'cover'};
       if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'};
        }
        return(
          <li 
            className="char__item"
            key={item.id}
            onClick={
              () => this.props.onCharSelected(item.id)
            }>
                <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                <div className="char__name">{item.name}</div>
          </li>
        )

        
    })
    
    return (
      <ul className="char__grid">
          {items}
      </ul>
    )
  }
  render(){

    const {charList, loading, error , newItemsLoading , offset} = this.state;
        
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
            onClick={() => this.onRequest(offset)} 
            className="button button__main button__long"
            disabled={newItemsLoading}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
  }
  
}

export default CharList;