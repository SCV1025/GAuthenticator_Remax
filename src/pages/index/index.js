import * as React from 'react';
import { View, Text, Image } from 'remax/one';
import styles from './index.module.scss';
import { Button, Icon, Card, Popup, Cell } from 'annar';
import { usePageEvent } from 'remax/macro';
import _ from 'lodash';
import * as dayjs from 'dayjs';

import {
    scanCode,
    setStorageSync,
    getStorageInfoSync,
    getStorageSync,
} from 'remax/wechat';
import * as OTPAuth from 'otpauth';

export default () => {
    //密码数据对象数组
    const [DATA, setDATA] = React.useState([]);
    //提示弹窗控制
    const [show, setShow] = React.useState(false);
    //提示内容
    const [popupTips, setPopupTips] = React.useState('');
    //输入秘钥弹窗控制
    const [showInput, setShowInput] = React.useState(false);
    //秘钥弹窗输入内容
    const [inputValue, setInputValue] = React.useState('');
    //倒计时计数器
    const [count, setCount] = React.useState(
        dayjs().second() < 30 ? 30 - dayjs().second() : 60 - dayjs().second(),
    );
    //页面加载时触发函数
    usePageEvent('onLoad', () => {
        dataInitialization();
    });
    //下拉刷新触发函数
    usePageEvent('onPullDownRefresh', () => {
        dataInitialization();
    });
    //倒计时计数器
    React.useEffect(() => {
        let id = setTimeout(() => {
            if (count > 1) {
                setCount(count - 1);
            } else if (count === 1) {
                if (dayjs().second() < 30) {
                    setCount(30 - dayjs().second());
                } else {
                    setCount(60 - dayjs().second());
                }
            }
        }, 1000);
        return () => clearInterval(id);
    });
    //数据初始化函数
    const dataInitialization = () => {
        try {
            //获取小程序localStorage内的所有的缓存数据
            const res = getStorageInfoSync();
            if (res.keys.length != 0) {
                //console.log(res.keys);
                let storageData = [];
                for (let i = 0; i < res.keys.length; i++) {
                    try {
                        let value = getStorageSync(res.keys[i]);
                        if (value) {
                            storageData[i] = {
                                key: res.keys[i],
                                rowData: OTPAuth.URI.parse(value),
                            };
                        }
                    } catch (e) {
                        console.log('第', i + 1, '条数据获取错误：', e);
                    }
                }
                //console.log('数据导入结果:', storageData);
                setDATA(storageData);
            } else {
                console.log('本地缓存为空啦');
            }
        } catch (e) {
            console.log('本地缓存读取失败');
        }
        //console.log('撒大声地所多所', dayjs().second());
        if (dayjs().second() < 30) {
            //console.log('莫名其妙', 30 - dayjs().second());
            setCount(30 - dayjs().second());
        } else {
            setCount(60 - dayjs().second());
        }
    };

    //扫描二维码
    const scan = () => {
        scanCode({
            success(res) {
                // res.result 为秘钥链接（二维码实质信息）
                console.log('成功扫码');
                addCode(res.result);
            },
            fail(res) {
                //console.log('扫码失败', res);
            },
        });
    };
    //通用添加秘钥方法
    const addCode = (uri) => {
        try {
            //console.log(OTPAuth.URI.parse(uri));
            if (DATA.length !== 0) {
                let isSame = false;
                for (let i = 0; i < DATA.length; i++) {
                    //注意：相同的uri经过多次转换可能会出现差异所以需要判断解码后是否相同
                    if (
                        OTPAuth.URI.parse(uri).generate() ===
                            DATA[i].rowData.generate() &&
                        OTPAuth.URI.parse(uri).label === DATA[i].rowData.label
                    ) {
                        isSame = true;
                        popupNow('可以重复添加，但没必要嗷！');
                        //console.log('不要重复添加秘钥！');
                        break;
                    }
                }
                if (!isSame) {
                    try {
                        setStorageSync(DATA.length.toString(), uri);
                    } catch (e) {
                        console.log('localStorage存储错误！', e);
                    }
                    let newData = _.cloneDeep(DATA);
                    newData.push({
                        key: DATA.length.toString(),
                        rowData: OTPAuth.URI.parse(uri),
                    });
                    console.log(DATA, JSON.parse(JSON.stringify(DATA)));
                    setDATA(newData);
                    //dataInitialization();
                }
            } else {
                try {
                    setStorageSync(DATA.length.toString(), uri);
                } catch (e) {
                    console.log('localStorage存储错误！', e);
                }
                try {
                    setStorageSync(DATA.length.toString(), uri);
                } catch (e) {
                    console.log('localStorage存储错误！', e);
                }
                let newData = _.cloneDeep(DATA);
                newData.push({
                    key: DATA.length.toString(),
                    rowData: OTPAuth.URI.parse(uri),
                });
                setDATA(newData);
            }
        } catch (e) {
            popupNow('抱歉，不支持当前的二维码/秘钥链接');
        }
    };
    //弹窗方法
    const popupNow = (tips) => {
        setPopupTips(tips);
        setShow(true);
    };

    return (
        <View className={styles.app}>
            <View className={styles.header}>
                <Button
                    size='large'
                    shape='square'
                    type='primary'
                    icon={<Icon type='scan' color='#fff' size='28px' />}
                    block
                    style={{ marginBottom: '15px' }}
                    onTap={() => {
                        scan();
                    }}
                >
                    {' '}
                    扫码添加
                </Button>
                <Button
                    plain
                    size='large'
                    shape='square'
                    type='primary'
                    icon={<Icon type='write' color='#1890ff' size='28px' />}
                    block
                    onTap={() => {
                        setShowInput(true);
                    }}
                >
                    {' '}
                    输入秘钥添加
                </Button>
            </View>
            <View className={styles.card_list}>
                {DATA.length > 0 ? (
                    DATA.map((item, index) => (
                        <View key={index}>
                            <Card
                                title={item.rowData.label}
                                className={styles.card}
                                foot={
                                    <View className={styles.foot}>
                                        {item.rowData.issuer}
                                    </View>
                                }
                            >
                                <View className={styles.content}>
                                    <View className={styles.row_l}>
                                        {item.rowData.generate()}
                                    </View>
                                    {count < 10 ? (
                                        <View className={styles.row_r}>
                                            0{count}
                                            <span
                                                style={{
                                                    paddingTop: '15px',
                                                    fontSize: '28px',
                                                }}
                                            >
                                                s
                                            </span>
                                        </View>
                                    ) : (
                                        <View className={styles.row_r}>
                                            {count}
                                            <span
                                                style={{
                                                    paddingTop: '15px',
                                                    fontSize: '28px',
                                                }}
                                            >
                                                s
                                            </span>
                                        </View>
                                    )}
                                </View>
                            </Card>
                            <View style={{ height: '15px' }} />
                        </View>
                    ))
                ) : (
                    <View className={styles.nodata}>
                        <Icon
                            style={{ paddingTop: '5px' }}
                            type='choiceness'
                            color='#a1d4fe'
                            size='36px'
                        />
                        <View className={styles.tips}>
                            暂无动态密码,快扫码添加吧！
                        </View>
                    </View>
                )}
            </View>
            {/**弹窗**/}
            <Popup
                open={show}
                onClose={() => {
                    setShow(false);
                }}
                closeable={true}
                curve={'ease'}
                style={{
                    width: '80%',
                    paddingTop: '55px',
                    paddingBottom: '45px',
                }}
            >
                <View
                    style={{
                        padding: '10px',
                        color: '#6d6d6d',
                        fontSize: '30px',
                    }}
                >
                    {popupTips}
                </View>
            </Popup>
            <Popup
                open={showInput}
                onClose={() => {
                    setShowInput(false);
                }}
                closeable={true}
                curve={'ease'}
                title={'手动添加动态密码'}
                style={{
                    width: '95%',
                    paddingBottom: '60px',
                }}
            >
                <Cell.Input
                    placeholder='请输入秘钥'
                    border={true}
                    value={inputValue}
                    onChange={(v) => {
                        setInputValue(v.target.value);
                    }}
                    style={{ paddingLeft: '40px', paddingTop: '15px' }}
                    extra={
                        <Button
                            type='primary'
                            size='small'
                            onTap={() => {
                                setShowInput(false);
                                if (inputValue) {
                                    addCode(inputValue);
                                } else {
                                    popupNow('请输入正确的动态密码链接');
                                }
                                setInputValue('');
                            }}
                        >
                            添加
                        </Button>
                    }
                />
            </Popup>
        </View>
    );
};
