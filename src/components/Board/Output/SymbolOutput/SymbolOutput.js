import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Symbol from '../../Symbol';
import BackspaceButton from './BackspaceButton';
import ClearButton from './ClearButton';
import messages from '../../Board.messages';
import PhraseShare from '../PhraseShare';
import Scroll from './Scroll';
import './SymbolOutput.css';
import { injectIntl } from 'react-intl';

class SymbolOutput extends PureComponent {
  constructor(props) {
    super(props);
    this.scrollContainerRef = React.createRef();
    this.state = {
      openPhraseShareDialog: false
    };
  }

  onShareClick = () => {
    this.setState({ openPhraseShareDialog: true });
  };

  onShareClose = () => {
    this.setState({ openPhraseShareDialog: false });
  };

  static propTypes = {
    /**
     * Symbols to output
     */
    symbols: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Image to display
         */
        image: PropTypes.string,
        /**
         * Label to display
         */
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
      })
    )
  };

  static defaultProps = {
    symbols: []
  };

  scrollToLastSymbol = () => {
    try {
      const lastOutputSymbol = this.scrollContainerRef.current
        ?.lastElementChild;
      if (lastOutputSymbol)
        lastOutputSymbol.scrollIntoView({
          inline: 'end'
        });
    } catch (err) {
      console.error('Error during autoScroll of output bar', err);
    }
  };

  componentDidMount() {
    this.scrollToLastSymbol();
  }

  componentDidUpdate(prevProps) {
    const { symbols } = this.props;
    if (prevProps.symbols.length < symbols.length) this.scrollToLastSymbol();
  }

  render() {
    const {
      intl,
      onBackspaceClick,
      onClearClick,
      getPhraseToShare,
      onCopyClick,
      onRemoveClick,
      onSwitchLiveMode,
      onWriteSymbol,
      symbols,
      navigationSettings,
      phrase,
      isLiveMode,
      increaseOutputButtons,
      ...other
    } = this.props;

    const clearButtonStyle = {
      visibility: symbols.length ? 'visible' : 'hidden'
    };

    const copyButtonStyle = {
      visibility: symbols.length ? 'visible' : 'hidden'
    };

    const removeButtonStyle = {
      visibility: navigationSettings.removeOutputActive ? 'visible' : 'hidden'
    };

    const backspaceButtonStyle = {
      visibility: navigationSettings.removeOutputActive ? 'hidden' : 'visible'
    };

    return (
      <div className="SymbolOutput">
        <Scroll scrollContainerReference={this.scrollContainerRef} {...other}>
          {symbols.map(({ image, label, type }, index) => (
            <div
              className={
                type === 'live'
                  ? 'LiveSymbolOutput__value'
                  : 'SymbolOutput__value'
              }
              key={index}
            >
              <Symbol
                className="SymbolOutput__symbol"
                image={image}
                label={label}
                type={type}
                labelpos="Below"
                onWrite={onWriteSymbol(index)}
                intl={intl}
              />
              <div className="SymbolOutput__value__IconButton">
                <IconButton
                  color="inherit"
                  size={'small'}
                  onClick={onRemoveClick(index)}
                  disabled={!navigationSettings.removeOutputActive}
                  style={removeButtonStyle}
                >
                  <ClearIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </Scroll>
        <div
          style={{
            display: 'flex',
            marginLeft: 'auto',
            minWidth: 'fit-content'
          }}
        >
          {navigationSettings.shareShowActive && (
            <PhraseShare
              label={intl.formatMessage(messages.share)}
              intl={this.props.intl}
              onShareClick={this.onShareClick}
              onShareClose={this.onShareClose}
              publishBoard={this.publishBoard}
              onCopyPhrase={onCopyClick}
              open={this.state.openPhraseShareDialog}
              phrase={this.props.phrase}
              style={copyButtonStyle}
              hidden={!symbols.length}
              increaseOutputButtons={increaseOutputButtons}
            />
          )}

          {!navigationSettings.removeOutputActive && (
            <BackspaceButton
              color="inherit"
              onClick={onBackspaceClick}
              style={backspaceButtonStyle}
              hidden={navigationSettings.removeOutputActive}
              increaseOutputButtons={increaseOutputButtons}
            />
          )}
          <div
            className={
              increaseOutputButtons
                ? 'SymbolOutput__right__btns__lg'
                : 'SymbolOutput__right__btns'
            }
          >
            {navigationSettings.liveMode && (
              <FormControlLabel
                value="bottom"
                className={increaseOutputButtons ? 'Live__switch_lg' : null}
                control={
                  <Switch
                    size="small"
                    checked={isLiveMode}
                    color="primary"
                    onChange={onSwitchLiveMode}
                  />
                }
                label={intl.formatMessage(messages.live)}
                labelPlacement="bottom"
              />
            )}
            <ClearButton
              color="inherit"
              onClick={onClearClick}
              style={clearButtonStyle}
              hidden={!symbols.length}
              increaseOutputButtons={increaseOutputButtons}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(SymbolOutput);
