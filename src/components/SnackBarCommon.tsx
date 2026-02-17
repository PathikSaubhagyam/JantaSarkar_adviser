import Snackbar from 'react-native-snackbar';
import { COLORS } from '../constants/Colors';

const SnackBarCommon = {
  displayMessage: ({
    message,
    isSuccess = false,
    duration = Snackbar.LENGTH_SHORT,
  }) => {
    if (!message) return;

    Snackbar.show({
      text: message,
      duration: duration,
      backgroundColor: isSuccess ? COLORS.bg_success : COLORS.color_snackbar,
      textColor: COLORS.white,
      numberOfLines: 2,
    });
  },
};

export default SnackBarCommon;
