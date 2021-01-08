import * as React from 'react';
import { View, Text, Image } from 'remax/one';
import { Card, Button, Icon } from 'annar';
import styles from './index.module.scss';
//引用微信小程序原生api
import { scanCode } from 'remax/wechat';

const Row = ({ index, style }) => (
    <View style={style}>这是列表中的Item {index}</View>
);

export default () => {
    return (
        <View className={styles.app}>
            <View className={styles.header}>
                <Image
                    src='https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ'
                    className={styles.logo}
                    alt='logo'
                />
                <View className={styles.text}>
                    编辑{' '}
                    <Text className={styles.path}>
                        src/pages/test1/index.js
                    </Text>{' '}
                    开始
                </View>
                <Card>
                    <Button>默认按钮</Button>
                    <Button
                        type='primary'
                        onTap={() => {
                            scan();
                        }}
                    >
                        调起相机扫码
                    </Button>
                </Card>
            </View>
        </View>
    );
};
