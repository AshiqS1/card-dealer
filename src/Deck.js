import React, { Component } from 'react';
import Card from './Card';
import './Deck.css';
import axios from 'axios';

const API_BASE_URL = "https://deckofcardsapi.com/api/deck/"

class Deck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // initial value of state.
            deck: null,
            drawnCards: []
        };
        this.getCard = this.getCard.bind(this);
    }

    // componentDidMount function runs on page load.
    async componentDidMount() {
        // make request to get deck info.
        let deck = await axios.get(`${API_BASE_URL}/new/shuffle`);

        // set state using deck info from API.
        this.setState({ deck: deck.data })
    }

    async getCard() {
        try {
            // make request to get card info, using deck id.
            let cardRes = await axios.get(`${API_BASE_URL}/${this.state.deck.deck_id}/draw`);
            console.log(cardRes.data);

            // if success === false from card API response, throw an error saying no more cards in deck. 
            // Potential cause of errors - no more remaining cards in deck, or invalid deck id. 
            if (cardRes.data.success === false) {
                throw new Error("No more cards in this deck!");
            }

            // store card response data in new variable.
            let card = { ...cardRes.data.cards[0] }

            // set state using new card info from API.
            this.setState(st => ({
                drawnCards: [...st.drawnCards, { id: card.code, image: card.image, name: `${card.value} Of ${card.suit}` }]
            }))
        } catch (err) {
            alert(err);
        }
    }

    // Render card components by mapping over this.state.drawnCards array. 
    renderCards() {
        return (
            this.state.drawnCards.map(card => (
                <Card
                    key={card.id}
                    image={card.image}
                    name={card.name}
                />
            ))
        )
    }

    render() {
        return (
            <div className="Deck">
                <h1 className="Deck-title ">♦Card Dealer♦</h1>
                <h2 className="Deck-title subtitle">♢♦Draw a random card from a 52 card deck!♦♢</h2>
                <button className="Deck-btn" onClick={this.getCard}>Draw card</button>
                <div className="Deck-cardarea">
                    {this.renderCards()}
                </div>
            </div>
        )
    }
}

export default Deck;