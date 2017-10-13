import React from 'react'
import PropTypes from 'prop-types'
import { WithContext as ReactTags } from 'react-tag-input'
import { FormattedMessage } from 'react-intl'

import messages from './messages'

class TagEditor extends React.PureComponent {
  onAddTag(tag) {
    const arr = this.props.tags.slice()
    arr.push(tag)
    this.props.onChange(arr)
  }

  onDeleteTag(i) {
    const arr = this.props.tags.slice()
    arr.splice(i, 1)
    this.props.onChange(arr)
  }

  onDragTag(curPos, newPos) {
    const arr = this.props.tags.slice()
    const t = arr.splice(curPos, 1)
    arr.splice(newPos, 0, ...t)
    this.props.onChange(arr)
  }

  render() {
    const { name, tags, suggestions } = this.props
    const tagArray = tags.map((text) => ({ id: text, text }))

    return (
      <FormattedMessage {...messages.addNewTag}>
        {(placeholder) => (
          <ReactTags
            name={name}
            classNames={{
              tag: 'btn',
              remove: 'badge',
              tagInput: 'open',
              tagInputField: 'form-control',
              suggestions: 'dropdown-menu suggestion',
              activeSuggestion: 'active'
            }}
            tags={tagArray}
            placeholder={placeholder}
            suggestions={suggestions}
            minQueryLength={1}
            handleAddition={(tag) => this.onAddTag(tag)}
            handleDelete={(i) => this.onDeleteTag(i)}
            handleDrag={(tag, curPos, newPos) => this.onDragTag(curPos, newPos)}
          />
        )}
      </FormattedMessage>
    )
  }
}

TagEditor.defaultProps = {
  name: 'tags',
  tags: [],
  placeholder: 'Add new tag',
  suggestions: [],
  onChange: () => {}
}

TagEditor.propTypes = {
  name: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
}

export default TagEditor

