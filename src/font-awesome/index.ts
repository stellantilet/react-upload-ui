import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faFile,
  faFilePdf,
  faFileArchive,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faPlus,
  faChevronUp,
  faChevronDown,
  faTimes,
  faSpinner,
  faCheckCircle,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons'

export default {
  init: () =>
    library.add(
      faFile,
      faFilePdf,
      faFileArchive,
      faFileExcel,
      faFileImage,
      faFileVideo,
      faPlus,
      faChevronUp,
      faChevronDown,
      faTimes,
      faSpinner,
      faCheckCircle,
      faRedoAlt
    ),
}
