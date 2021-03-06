import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Odometer from 'react-odometerjs';
import { GridLoader } from 'halogenium';

export default class VoteResultsList extends Component {
  render() {
    const { votes: votesState, primaryColor } = this.props;
    const { votes } = votesState;
    const title = 'Vote Results';

    const items =
      Object.keys(votes).length === 0 ? (
        <GridLoader className="min-height-short flex-center" color={primaryColor} />
      ) : (
        Object.keys(votes)
          .map(key => votes[key])
          .sort((a, b) => (a.votes > b.votes ? -1 : 1))
          .map(value => {
            const { votes: count, color, name, termId } = value;
            const style = { color };
            return (
              <div className="list-group-item border-0" key={termId} style={style} title={name}>
                <span className="mr-2">{name}</span>
                &nbsp;
                <Odometer format="(,ddd)" value={count} />
                <hr className="p-0 m-0" />
              </div>
            );
          })
      );

    return (
      <section className="h-100 w-100 d-flex flex-column" title={title}>
        <header className="d-none d-md-block p-2 card-header">
          <h5 className="text-nowrap text-truncate mb-0">{title}</h5>
        </header>
        <div className="list-group medium-list min-height-medium">{items}</div>
      </section>
    );
  }
}

VoteResultsList.propTypes = {
  votes: PropTypes.any,
  primaryColor: PropTypes.string,
};
