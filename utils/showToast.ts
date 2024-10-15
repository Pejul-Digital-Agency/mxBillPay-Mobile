import Toast from 'react-native-toast-message';
import { COLORS } from '@/constants';

interface toastProps {
  type: 'error' | 'success' | 'info' | 'warning';
  text1: string;
  text2?: string;
}
export default function showToast({ type, text1, text2 }: toastProps) {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top',
    visibilityTime: 3000,
    swipeable: true,
    props: {
      customStyle: {
        backgroundColor: COLORS.white,
        borderLeftColor: COLORS[type],
        textColor: COLORS[type],
      },
    },
  });
}
