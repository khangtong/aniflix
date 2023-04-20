import axios from 'axios';
import { showAlert } from './alerts';

export const handleFavorites = async (id, action) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/films/${id}/${action}-favorites`,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${action.toUpperCase()} ${
          action === 'add' ? 'to' : 'from'
        } favorites successfully`
      );
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
