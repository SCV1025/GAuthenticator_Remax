import * as React from 'react';
import { View } from 'remax/one';
import styles from './index.module.scss';
import { Button, Card, Cell, Form, Icon, Popup, Tabs } from 'annar';
import { usePageEvent } from 'remax/macro';
import _ from 'lodash';
import * as dayjs from 'dayjs';

import {
    getStorageInfoSync,
    getStorageSync,
    removeStorageSync,
    scanCode,
    setStorageSync,
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
    const [stateKey1, setStateKey1] = React.useState('0');

    //手动输入-秘钥链接函数
    const handleFinish1 = (values) => {
        //console.log('values', values);
        addCode(values.link);
        setShowInput(false);
    };
    //手动输入-秘钥详情函数
    const handleFinish2 = (values) => {
        console.log('values', values);
        let totp = new OTPAuth.TOTP({
            issuer: values.address,
            label: values.user,
            secret: values.secret,
        });
        console.log(totp.toString());
        addCode(totp.toString());
        setShowInput(false);
    };
    const handleFinishFailed = (values, errorFields) => {
        console.log('errorFields', errorFields);
    };

    const tabs1 = [
        {
            key: '0',
            title: '秘钥链接',
            content: (
                <Form
                    onFinish={handleFinish1}
                    onFinishFailed={handleFinishFailed}
                >
                    <Form.Item
                        name='link'
                        rules={[
                            {
                                pattern: /otpauth:/,
                                message: ' 请输入正确的动态密码分享链接',
                            },
                            {
                                require: true,
                                message: ' 请输入正确的动态密码分享链接',
                            },
                        ]}
                    >
                        <Cell.Input
                            icon='like'
                            label='链接'
                            placeholder='请输入'
                            border={false}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 40, padding: '0 10px' }}>
                        <Button
                            type='primary'
                            size='large'
                            shape='square'
                            //look='orange'
                            block
                            nativeType='submit'
                        >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: '1',
            title: ' 秘钥详情',
            content: (
                <Form
                    onFinish={handleFinish2}
                    onFinishFailed={handleFinishFailed}
                >
                    <Form.Item
                        name='user'
                        rules={[
                            {
                                required: true,
                                message: ' 请输入用户名',
                            },
                        ]}
                    >
                        <Cell.Input
                            icon='people'
                            label='用户名'
                            placeholder='请输入用户名'
                            border={false}
                        />
                    </Form.Item>
                    <Form.Item
                        name='secret'
                        rules={[
                            {
                                pattern: /\w{16}/,
                                message: ' 请输入正确的动态密码秘钥',
                            },
                            {
                                required: true,
                                message: ' 请输入正确的动态密码秘钥',
                            },
                        ]}
                    >
                        <Cell.Input
                            icon='like'
                            label='秘钥'
                            placeholder='请输入秘钥'
                            border={false}
                        />
                    </Form.Item>
                    <Form.Item
                        name='address'
                        rules={[
                            {
                                required: true,
                                message: ' 请输入正确的网址',
                            },
                        ]}
                    >
                        <Cell.Input
                            icon='link'
                            label='来源网址'
                            placeholder='请输入'
                            border={false}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 40, padding: '0 10px' }}>
                        <Button
                            type='primary'
                            size='large'
                            shape='square'
                            //look='orange'
                            block
                            nativeType='submit'
                        >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

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
    //生成UUID
    const setUUID = () => {
        let temp_url = URL.createObjectURL(new Blob());
        let uuid = temp_url.toString();
        URL.revokeObjectURL(temp_url);
        return uuid.substr(uuid.lastIndexOf('/') + 1);
    };
    //通用删除秘钥方法
    const deleteCode = (uuid) => {
        try {
            removeStorageSync(uuid);
            setDATA((data) => data.filter((v) => v.key !== uuid));
        } catch (e) {
            console.log('localStorage删除错误！', e);
        }
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
                    let uuid;
                    while (1) {
                        uuid = setUUID();
                        try {
                            let value = getStorageSync(uuid);
                            if (!value) {
                                try {
                                    setStorageSync(uuid, uri);
                                } catch (e) {
                                    console.log('localStorage存储错误！', e);
                                }
                                break;
                            }
                        } catch (e) {
                            try {
                                setStorageSync(uuid, uri);
                            } catch (e) {
                                console.log('localStorage存储错误！', e);
                            }
                            break;
                        }
                    }
                    let newData = _.cloneDeep(DATA);
                    newData.push({
                        key: uuid,
                        rowData: OTPAuth.URI.parse(uri),
                    });
                    console.log(DATA, JSON.parse(JSON.stringify(DATA)));
                    setDATA(newData);
                    //dataInitialization();
                }
            } else {
                let uuid = setUUID();
                try {
                    setStorageSync(uuid, uri);
                } catch (e) {
                    console.log('localStorage存储错误！', e);
                }
                try {
                    setStorageSync(uuid, uri);
                } catch (e) {
                    console.log('localStorage存储错误！', e);
                }
                let newData = _.cloneDeep(DATA);
                newData.push({
                    key: uuid,
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
                                extra={
                                    <Button
                                        danger
                                        shape='square'
                                        icon={
                                            <Icon
                                                type='delete'
                                                color='#da2500'
                                                size='28px'
                                            />
                                        }
                                        block
                                        onTap={() => {
                                            deleteCode(item.key);
                                        }}
                                    >
                                        {' '}
                                        删除
                                    </Button>
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
                //title={'手动添加动态密码'}
                style={{
                    width: '95%',
                    paddingTop: '15px',
                    backgroundColor: '#fff',
                }}
            >
                <Tabs
                    onTabClick={({ key }) => setStateKey1(key)}
                    activeKey={stateKey1}
                    // direction='vertical'
                    titleSquare
                    animated
                >
                    {tabs1.map((tab) => (
                        <Tabs.TabContent key={tab.key} tab={tab.title}>
                            <Card>
                                <View className={styles.tabContent}>
                                    {tab.content}
                                </View>
                            </Card>
                        </Tabs.TabContent>
                    ))}
                </Tabs>
                {/*<Cell.Input*/}
                {/*    placeholder='请输入秘钥'*/}
                {/*    border={true}*/}
                {/*    value={inputValue}*/}
                {/*    onChange={(v) => {*/}
                {/*        setInputValue(v.target.value);*/}
                {/*    }}*/}
                {/*    style={{ paddingLeft: '40px', paddingTop: '15px' }}*/}
                {/*    extra={*/}
                {/*        <Button*/}
                {/*            type='primary'*/}
                {/*            size='small'*/}
                {/*            onTap={() => {*/}
                {/*                setShowInput(false);*/}
                {/*                if (inputValue) {*/}
                {/*                    addCode(inputValue);*/}
                {/*                } else {*/}
                {/*                    popupNow('请输入正确的动态密码链接');*/}
                {/*                }*/}
                {/*                setInputValue('');*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            添加*/}
                {/*        </Button>*/}
                {/*    }*/}
                {/*/>*/}
            </Popup>
        </View>
    );
};
