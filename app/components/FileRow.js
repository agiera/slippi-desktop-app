import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Button, Image } from 'semantic-ui-react';
import styles from './FileLoader.scss';
import * as stageUtils from '../utils/stages';
import * as characterUtils from '../utils/characters';

const path = require('path');

export default class FileRow extends Component {
  props: {
    file: object,
    playFile: (file) => void,
    gameProfileLoad: (game) => void,

    // history
    history: object
  };

  playFile = () => {
    const file = this.props.file || {};

    // Play the file
    this.props.playFile(file);
  };

  viewStats = () => {
    const file = this.props.file || {};
    const fileGame = file.game;

    this.props.gameProfileLoad(fileGame);
    this.props.history.push('/game');
  };

  generatePlayCell() {
    return (
      <Table.Cell className={styles['play-cell']} textAlign="center">
        <Button
          circular={true}
          inverted={true}
          size="tiny"
          basic={true}
          icon="play"
          onClick={this.playFile}
        />
      </Table.Cell>
    );
  }

  generateFileNameCell() {
    const file = this.props.file || {};

    const fileName = file.fileName || "";
    const extension = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, extension);

    return (
      <Table.Cell singleLine={true}>
        {nameWithoutExt}
      </Table.Cell>
    );
  }

  generateTeamElements(settings) {
    // If this is a teams game, group by teamId, otherwise group players individually
    const teams = _.chain(settings.players).groupBy((player, idx) => (
      settings.isTeams ? player.teamId : player.port
    )).toArray();

    // This is an ugly way to do this...
    let elIdx = 0;
    const elements = [];
    teams.forEach((team, idx) => {
      const teamImages = team.map((player) => (
        <Image
          key={`player-port-${player.port}`}
          src={`../resources/images/stock-icon-${player.characterId}-${player.characterColor}.png`}
          inline={true}
          height={24}
          width={24}
        />
      ));

      elements.push(
        <span className="horizontal-spaced-group-right-xs" key={elIdx++}>
          {teamImages}
        </span>
      );

      if (idx >= teams.length - 1) {
        return;
      }

      elements.push(<span key={elIdx++}> vs </span>);
    });

    return elements;
  }

  generateCharacterCell() {
    const file = this.props.file || {};

    const settings = file.gameSettings || {};

    return (
      <Table.Cell singleLine={true}>
        {this.generateTeamElements(settings)}
      </Table.Cell>
    );
  }

  generateStageCell() {
    const file = this.props.file || {};

    const settings = file.gameSettings || {};
    const stageId = settings.stageId;
    const stageName = stageUtils.getStageName(stageId) || "Unknown";

    return (
      <Table.Cell singleLine={true}>
        {stageName}
      </Table.Cell>
    );
  }

  generateGameLengthCell() {
    const file = this.props.file || {};

    const gameInfo = file.gameInfo || {};
    const duration = gameInfo.duration || "Unknown";

    return (
      <Table.Cell singleLine={true}>
        {duration}
      </Table.Cell>
    );
  }

  generateOptionsCell() {
    return (
      <Table.Cell className={styles['play-cell']} textAlign="center">
        <Button
          circular={true}
          inverted={true}
          size="tiny"
          basic={true}
          icon="bar chart"
          onClick={this.viewStats}
        />
      </Table.Cell>
    );
  }

  render() {
    return (
      <Table.Row>
        {this.generatePlayCell()}
        {this.generateFileNameCell()}
        {this.generateCharacterCell()}
        {this.generateStageCell()}
        {this.generateGameLengthCell()}
        {this.generateOptionsCell()}
      </Table.Row>
    );
  }
}
