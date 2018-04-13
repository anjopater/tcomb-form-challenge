import React from 'react';
import t from 'tcomb-form';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'

class TagsComponent extends t.form.Component {
  getTemplate() {
    return (locals) => {
      return (
        <TagsInput value={locals.value} onChange={locals.onChange} disabled={locals.disabled} />
      );
    };
  }

}

export default TagsComponent;