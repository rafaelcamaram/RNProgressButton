import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/* Config - imports */
import { COLORS, SPACING } from './config';

class RNProgressButton extends React.PureComponent {
  state = {
    completed: '0%',
    incompleted: '0%'
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const splittedCompleted = nextProps.completed.split('%');
    const incompleted = splittedCompleted.length > 1 ? `${100 - parseInt(splittedCompleted[0])}%` : '0%';

    return {
      completed: nextProps.completed,
      incomplete: incompleted
    };
  }

  _renderButton(isActive) {
    const labelColor = isActive ? COLORS.white : COLORS.primary;
    const { onPress, completed, nextLabel, finishLabel } = this.props;

    return (
      <MoveForwardButton isActive={isActive} onPress={onPress}>
        {this.props.renderLabel(labelColor, completed === '100%' ? finishLabel : nextLabel)}
        {this.props.renderIcon(isActive)}
      </MoveForwardButton>
    );
  }

  _renderSecondaryButton(isActive) {
    if (!this.props.secondaryOption) return null;
    if (this.state.completed !== '100%') return null;

    const { onPress, label } = this.props.secondaryOption;
    const labelColor = isActive ? COLORS.white : COLORS.primary;

    return (
      <SecondaryButton isActive={isActive} onPress={onPress}>
        {this.props.renderLabel(labelColor, label)}
      </SecondaryButton>
    );
  }

  render() {
    return (
      <RNProgressButtonContainer>
        <IncompletePart percent={this.state.incomplete}>{this._renderButton(false)}</IncompletePart>
        <CompletedPart percent={this.state.completed} />
        {this._renderSecondaryButton(true)}
        {this._renderButton(true)}
      </RNProgressButtonContainer>
    );
  }
}

const RNProgressButtonContainer = styled.View`
  width: 100%;
  height: 60;

  align-items: flex-end;

  position: absolute;
  bottom: 0;
  left: 0;
`;

const MoveForwardButton = styled.TouchableOpacity`
  min-width: ${props => (!props.isActive ? 300 : 0)};
  height: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  position: absolute;
  z-index: 5;
  right: ${SPACING.medium};
`;

const SecondaryButton = styled.TouchableOpacity`
  min-width: ${props => (!props.isActive ? 300 : 0)};

  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  position: absolute;
  z-index: 5;
  left: ${SPACING.huge};
`;

const MoveForwardIcon = styled.Image`
  margin-left: ${SPACING.default};
  margin-right: ${SPACING.default};
`;

const Part = styled.View`
  height: 60;

  overflow: hidden;

  justify-content: center;
  align-items: flex-end;
`;

const IncompletePart = styled(Part)`
  width: ${props => (props.percent ? props.percent : '0%')};
  height: 60;

  background-color: ${props => (props.backgroundColor ? props.backgroundColor : COLORS.darkerBackground)};

  z-index: 10;
  padding-bottom: 30;
`;

const CompletedPart = styled(Part)`
  width: ${props => (props.percent ? props.percent : '0%')};
  height: 60;

  background-color: ${props => (props.backgroundColor ? props.backgroundColor : COLORS.primary)};

  position: absolute;
  top: 0;
  left: 0;
`;

const Label = styled.Text`
  text-align: right;
  font-weight: bold;
  color: ${props => props.color};
`;

RNProgressButton.defaultProps = {
  completed: '85%',
  onPress: () => {},
  renderLabel: (labelColor, label) => {
    return <Label color={labelColor}>{label}</Label>;
  },
  renderIcon: isActive => {
    const isActiveImage = isActive
      ? require('./assets/images/icContinueOff.png')
      : require('./assets/images/icContinue.png');
    return <MoveForwardIcon source={isActiveImage} />;
  },
  finishLabel: 'Finish',
  nextLabel: 'Next Step'
};

RNProgressButton.propTypes = {
  completed: PropTypes.string,
  onPress: PropTypes.func,
  secondaryOption: PropTypes.object,
  renderLabel: PropTypes.func,
  renderIcon: PropTypes.func,
  nextLabel: PropTypes.string,
  finishLabel: PropTypes.string
};

export default RNProgressButton;
