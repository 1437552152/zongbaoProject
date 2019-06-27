/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-undef-init */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
// import Link from 'umi/link';
import { connect } from "dva";
import StandardCard from "@/components/StandardCard";
import {
  Form,
  Row,
  // Col,
  message,
  // Empty,
  Spin,
  Button
} from "antd";
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import styles from "./index.less";

// const { Option } = Select;
// const FormItem = Form.Item;
// const format = "YYYY-MM-DD";
// const getWindowWidth = () =>
//   window.innerWidth || document.documentElement.clientWidth;

const MAX_CONTENT_LENGTH = 20000;
const config = {
  toolbars: [
    [
      "fullscreen",
      "source",
      "|",
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "underline",
      "fontborder",
      "strikethrough",
      "superscript",
      "subscript",
      "removeformat",
      "formatmatch",
      "|",
      "forecolor",
      "backcolor",
      "insertorderedlist",
      "insertunorderedlist",
      "selectall",
      "cleardoc",
      "|",
      "rowspacingtop",
      "rowspacingbottom",
      "lineheight",
      "|",
      "customstyle",
      "paragraph",
      "fontfamily",
      "fontsize",
      "|",
      "directionalityltr",
      "directionalityrtl",
      "indent",
      "|",
      "justifyleft",
      "justifycenter",
      "justifyright",
      "justifyjustify",
      "|",
      "touppercase",
      "tolowercase",
      "|",
      "imagenone",
      "imageleft",
      "imageright",
      "imagecenter",
      "|",
      "simpleupload",
      "horizontal",
      "date",
      "time"
    ]
  ],
  lang: "zh-cn",
  // 字体
  fontfamily: [
    { label: "", name: "songti", val: "宋体,SimSun" },
    { label: "", name: "kaiti", val: "楷体,楷体_GB2312, SimKai" },
    { label: "", name: "yahei", val: "微软雅黑,Microsoft YaHei" },
    { label: "", name: "heiti", val: "黑体, SimHei" },
    { label: "", name: "lishu", val: "隶书, SimLi" },
    { label: "", name: "andaleMono", val: "andale mono" },
    { label: "", name: "arial", val: "arial, helvetica,sans-serif" },
    { label: "", name: "arialBlack", val: "arial black,avant garde" },
    { label: "", name: "comicSansMs", val: "comic sans ms" },
    { label: "", name: "impact", val: "impact,chicago" },
    { label: "", name: "timesNewRoman", val: "times new roman" }
  ],
  fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36],
  autoHeightEnabled: true,
  initialFrameHeight: 300,
  initialFrameWidth: "100%",
  enableAutoSave: false,
  maximumWords: MAX_CONTENT_LENGTH
};

@connect(({ energyServices, loading }) => ({
  energyServices,
  treeLoading: loading.effects["energyServices/getScreen"] || false,
  infoLoading: loading.effects["energyServices/getScreenData"] || false,
  updataLoading: loading.effects["energyServices/updataScreenData"] || false
}))
@Form.create()
class informationScreen extends Component {
  state = {
    areaTree: [],
    selectList: {}
  };

  componentDidMount() {
    this.getTreeList();
    this.readyEditor("info");
  }

  readyEditor = (id, content) => {
    UE.delEditor(id);
    if (UE) {
      UE.getEditor(id, config);
      if (content !== undefined) {
        UE.getEditor(id).ready(() => {
          UE.getEditor(id).setContent(content, false);
        });
      }
    }
  };

  getTreeList = () => {
    this.props.dispatch({
      type: "energyServices/getScreen",
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            this.setState({
              areaTree: data.data
            });
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取信息发布屏列表失败，请刷新页面后重试！");
        }
      }
    });
  };

  getParentList = (list, callback) => {
    const { areaTree } = this.props.energyServices;
    if (areaTree !== undefined && areaTree.length > 0) {
      if (Number(list.fid) === 0) {
        callback(0);
      } else {
        const arr = [];
        const getNewList = tree => {
          for (let i = 0; i < tree.length; i++) {
            arr.push(tree[i]);
            if (tree[i].children !== undefined && tree[i].children.length > 0) {
              getNewList(tree[i].children);
            }
          }
        };
        const newTree = JSON.parse(JSON.stringify(areaTree));
        getNewList(newTree);

        const getListInfo = fid => {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].id === fid) {
              return arr[j];
            }
          }
        };

        let area = undefined;
        let building = undefined;
        let floors = undefined;

        if (list.type === "003") {
          floors = list.name;
          const a1 = getListInfo(list.fid);
          building = a1.name;
          const a2 = getListInfo(a1.fid);
          area = a2.name;
        } else if (list.type === "002") {
          building = list.name;
          const a3 = getListInfo(list.fid);
          area = a3.name;
        } else {
          area = list.name;
        }

        const params = `&area=${area}${
          building !== undefined ? `&building=${building}` : ""
        }${floors !== undefined ? `&floors=${floors}` : ""}`;
        callback(params);
      }
    }
  };

  onAreaTreeSelect = selectedKeys => {
    this.getScreenData(selectedKeys[0]);
  };

  getScreenData = id => {
    this.props.dispatch({
      type: "energyServices/getScreenData",
      payload: id,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            this.setState(
              {
                selectList: data.data
              },
              () => {
                UE.getEditor("info").setContent(data.data.data.content, false);
              }
            );
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取信息发布屏内容失败，请刷新页面后重试！");
        }
      }
    });
  };

  renderSider = () => {
    const { areaTree } = this.state;
    return (
      <div className={styles.monitor_left}>
        <Spin spinning={this.props.treeLoading}>
          <div className={styles.monitor_tree}>
            <CommonSiderBar
              areaTreeList={areaTree}
              onAreaTreeSelect={this.onAreaTreeSelect}
            />
          </div>
        </Spin>
      </div>
    );
  };

  saveContent = () => {
    const { selectList } = this.state;
    const content = UE.getEditor("info").getContent();
    // console.log(selectList);
    this.props.dispatch({
      type: "energyServices/updataScreenData",
      payload: {
        id: selectList.id,
        content
      },
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            message.success("发布成功！");
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("发布失败，请刷新页面后重试！");
        }
      }
    });
  };

  resetContent = () => {
    UE.getEditor("info").setContent("");
  };

  renderContent = () => {
    const pic = require("@/assets/setting.png");
    const { selectList } = this.state;
    return (
      <Spin spinning={this.props.infoLoading || this.props.updataLoading}>
        <StandardCard className="card_container" src={pic}>
          <div className={styles.monitor_right}>
            {/* <div className={styles.right_title}>
              <img alt="" src={pic} />
              <p className={styles.personCTitleTxt}>
                管理<span style={{ margin: "0 8px" }}>/</span>运营管理
                <span style={{ margin: "0 8px" }}>/</span>信息发布屏
              </p>
            </div> */}
            <div className={styles.monitor_right_content}>
              <Row span={24} gutter={20}>
                <div
                  id="info"
                  style={{ width: "100%", lineHeight: "20px", height: "400px" }}
                />
              </Row>
              <Row span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  type="primary"
                  onClick={() => this.saveContent()}
                  disabled={
                    Object.keys(selectList).length > 0 ? false : "disabled"
                  }
                >
                  发布
                </Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  onClick={() => this.resetContent()}
                >
                  取消
                </Button>
              </Row>
            </div>
          </div>
        </StandardCard>
      </Spin>
    );
  };

  render() {
    return (
      <div className={styles.screen_box}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />
      </div>
    );
  }
}
export default informationScreen;
