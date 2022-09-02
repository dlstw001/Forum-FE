import { decorate, observable } from 'mobx';

class EditorStore {
  isPreview = localStorage.getItem('editor') === 'true' || false;
}

export default decorate(EditorStore, {
  isPreview: observable,
});
