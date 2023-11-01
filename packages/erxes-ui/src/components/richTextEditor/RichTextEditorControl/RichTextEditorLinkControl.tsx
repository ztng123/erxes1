import React, { useRef, useState } from 'react';
import { OverlayTrigger, PopoverContent } from 'react-bootstrap';
import { Link, BoxArrowUpRight } from 'react-bootstrap-icons';
import { useRichTextEditorContext } from '../RichTextEditor.context';
import {
  RichTextEditorControlBaseProps,
  RichTextEditorControlBase
} from './RichTextEditorControl';
import Tip from '../../Tip';
import { InputAction, InputWrapper, LinkInput, LinkWrapper } from './styles';

const LinkIcon: RichTextEditorControlBaseProps['icon'] = props => (
  <Link {...props} />
);

export const RichTextEditorLinkControl = props => {
  const {
    classNames,
    className,
    style,
    styles,
    vars,
    icon,
    popoverProps,
    disableTooltips,
    initialExternal,
    ...others
  } = props;

  const ctx = useRichTextEditorContext();

  const [url, setUrl] = useState('');
  const [external, setExternal] = useState(initialExternal);
  const [opened, setOpened] = useState(false);

  const open = () => {
    setOpened(true);
  };
  const close = () => {
    setOpened(false);
  };

  const handleOpen = () => {
    open();
    const linkData = ctx.editor?.getAttributes('link');
    setUrl(linkData?.href || '');
    setExternal(linkData?.target === '_blank');
  };

  const handleClose = () => {
    close();
    setUrl('');
    setExternal(initialExternal);
  };

  const setLink = () => {
    handleClose();
    url === ''
      ? ctx.editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()
      : ctx.editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url, target: external ? '_blank' : null })
          .run();
  };

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLink();
    }
  };

  //   useWindowEvent('edit-link', handleOpen, false);

  return (
    <OverlayTrigger
      ref={overlayTrigger => {
        overlayTrigger = overlayTrigger;
      }}
      trigger="click"
      placement="top"
      rootClose={true}
      overlay={
        <LinkWrapper>
          <InputWrapper>
            <LinkInput
              placeholder={ctx.labels.linkEditorInputPlaceholder}
              aria-label={ctx.labels.linkEditorInputLabel}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleInputKeydown}
            />
            <InputAction>
              <Tip
                placement="top"
                text={
                  external
                    ? ctx.labels.linkEditorExternalLink
                    : ctx.labels.linkEditorInternalLink
                }
              >
                <button
                  onClick={() => setExternal(e => !e)}
                  data-active={external || undefined}
                >
                  <BoxArrowUpRight
                    style={{ width: '0.875rem', height: '0.875rem' }}
                  />
                </button>
              </Tip>
            </InputAction>
          </InputWrapper>
          <button onClick={setLink}>{ctx.labels.linkEditorSave}</button>
        </LinkWrapper>
      }
    >
      <RichTextEditorControlBase
        icon={icon || LinkIcon}
        {...others}
        aria-label={ctx.labels.linkControlLabel}
        title={ctx.labels.linkControlLabel}
        onClick={handleOpen}
        active={ctx.editor?.isActive('link')}
        className={className}
        style={style}
      />
    </OverlayTrigger>
  );
};
