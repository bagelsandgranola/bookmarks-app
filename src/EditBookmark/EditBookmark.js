import React, { Component } from 'react';
import BookmarksContext from '../BookmarkContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

export default class EditBookmark extends Component {
    static contextType = BookmarksContext;

    state = {
        title: '',
        url: '',
        description: '',
        rating: '',
        error: null,
    };

    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId

        fetch(`https://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
              'authorization': `Bearer ${config.API_KEY}`
            }
        })
        .then(res => {
          if (!res.ok)
            return res.json().then(error => Promise.reject(error))

          return res.json()
        })
        .then(responseData => {
            this.setState({
                title: responseData.title,
                url: responseData.url,
                description: responseData.description,
                rating: responseData.rating,
                /* fields state updates here */
            })
        })
        .catch(error => {
          console.error(error)
          this.setState({ error })
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        //validation not shown
        fetch(`https://localhost:8000/api/bookmarks/${this.props.match.params.bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(this.state.inputValues),
            headers: {
              'content-type': 'application/json',
              'authorization': `Bearer ${config.API_KEY}`
            },
        })
        .then(res => {
          if (!res.ook)
            return res.json().then(error => Promise.reject(error))
        })
        .then(responseData => {
            this.context.updateBookmark(responseData)
        })
        .catch(error => {
          console.error(error)
          this.setState({ error })
        })
    }
    render() {
        const { error, title, url, description, rating } = this.state
        return (
          <section className='AddBookmark'>
            <h2>Edit bookmark</h2>
            <form 
              className='AddBookmark__form'
              onSubmit={this.handleSubmit}
            >
              <div className='AddBookmark__error' role='alert'>
                {error && <p>{error.message}</p>}
              </div>
              <div>
                <label htmlFor='title'>
                  Title
                  {' '}
                  <Required />
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  placeholder='Great website!'
                  required
                  value={title}
                />
              </div>
              <div>
                <label htmlFor='url'>
                  URL
                  {' '}
                  <Required />
                </label>
                <input
                  type='url'
                  name='url'
                  id='url'
                  placeholder='https://www.great-website.com/'
                  required
                  value={url}

                />
              </div>
              <div>
                <label htmlFor='description'>
                  Description
                </label>
                <textarea
                  name='description'
                  id='description'
                  value={description}
                />
              </div>
              <div>
                <label htmlFor='rating'>
                  Rating
                  {' '}
                  <Required />
                </label>
                <input
                  type='number'
                  name='rating'
                  id='rating'
                  defaultValue='1'
                  min='1'
                  max='5'
                  required
                  value={rating}

                />
              </div>
              <div className='AddBookmark__buttons'>
                <button type='button' onClick={this.handleClickCancel}>
                  Cancel
                </button>
                {' '}
                <button type='submit'>
                  Save
                </button>
              </div>
            </form>
          </section>
        );
      }
    }
