import * as React from 'react';
import { View, Image } from 'remax/one';
import styles from './index.module.scss';

export default () => {
    return (
        <View className={styles.app}>
            <View className={styles.header}>
                <Image
                    src='https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ'
                    className={styles.logo}
                    alt='logo'
                />
                <View className={styles.text}>~ 正在开发中 ~</View>
            </View>
        </View>
    );
};
