(function ($) {
    $.fn.extend({
        //初始化
        loadStep: function (params) {
            if (params) {
                //参数类型
                //["开始", "结束"]
                //[{ title: "开始", content: "流程开始" }, { title: "结束", content: "流程结束" }]
                //{ current: 2, steps: ["开始", "结束"] }
                //{ current: 2, steps: [{ title: "开始", content: "流程开始" }, { title: "结束", content: "流程结束" }] }
                if (params.steps && params.steps.length > 0) {
                    if (typeof params.steps[0] == "string") {
                        var arr = [];
                        for (var i in params.steps) {
                            arr.push({ title: params.steps[i] })
                        }
                        params.steps = arr;
                    }
                }
                else if (typeof params == "object") {
                    if (params[0].title)
                        params.steps = params;
                    else {
                        var arr = [];
                        for (var i in params) {
                            arr.push({ title: params[i] })
                        }
                        params = { steps: arr };
                    }
                }
                else {
                    params = { steps: [{ title: params }] };
                }
            }
            else {
                return false;
            }

            //基础框架
            var baseHtml = "<div class='step-container step-lg step-blue'>" +
                              "<ul class='step-container-steps clearfix'></ul>" +
                              "<div class='step-progress'>" +
                                "<div class='step-progress-bar'><div class='step-progress-highlight'></div></div>" +
                              "</div>" +

                            "</div>";
            //步骤框架
            var stepHtml = "<li class='step-step step-step-undone'></li>";

            //支持填充多个步骤容器
            $(this).each(function (i, n) {
                var $baseHtml = $(baseHtml),
                $stepHtml = $(stepHtml),
                $stepContainerSteps = $baseHtml.find(".step-container-steps"),
                arrayLength = 0,
                $n = $(n),
                i = 0;

                //步骤
                arrayLength = params.steps.length;
                var liW = 100 / arrayLength;
                for (i = 0; i < arrayLength; i++) {
                    var _s = params.steps[i];
                    //构造步骤html
                    $stepHtml.css("width", liW + "%").html('<div class="step-text">' + _s.title + '</div><div><i class="glyphicon glyphicon-remove"></i></div>').attr("title", _s.content || _s.title);
                    //将步骤插入到步骤列表中
                    $stepContainerSteps.append($stepHtml);
                    //重置步骤
                    $stepHtml = $(stepHtml);
                }

                $baseHtml.find(".step-progress").css({ "left": (liW / 2) + "%", "width": (100 - liW) + "%" });
                //插入到容器中
                $n.html($baseHtml);

                //默认执行第一个步骤
                $n.setStep(params.current || 1);
            });
        },
        //跳转到指定步骤
        setStep: function (step) {
            $(this).each(function (i, n) {
                //获取当前容器下所有的步骤
                var $steps = $(n).find(".step-container").find("li");
                var $progress = $(n).find(".step-container").find(".step-progress-highlight");
                //判断当前步骤是否在范围内
                if (1 <= step && step <= $steps.length) {
                    //更新进度
                    var scale = "%";
                    scale = Math.round((step - 1) * 100 / ($steps.length - 1)) + scale;
                    $progress.animate({
                        width: scale
                    }, {
                        speed: 1000,
                        done: function () {
                            //移动节点
                            $steps.each(function (j, m) {
                                var _$m = $(m);
                                var _j = j + 1;
                                if (_j < step) {
                                    _$m.attr("class", "step-step-done").find(".glyphicon").attr("class", "glyphicon glyphicon-ok");
                                } else if (_j === step) {
                                    _$m.attr("class", "step-step-active").find(".glyphicon").attr("class", "glyphicon glyphicon-map-marker");
                                } else if (_j > step) {
                                    _$m.attr("class", "step-step-undone").find(".glyphicon").attr("class", "glyphicon glyphicon-remove");
                                }
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //获取当前步骤
        getStep: function () {
            var result = [];

            $(this)._searchStep(function (i, j, n, m) {
                result.push(j + 1);
            });

            if (result.length == 1) {
                return result[0];
            } else {
                return result;
            }
        },
        //下一个步骤
        nextStep: function () {
            $(this)._searchStep(function (i, j, n, m) {
                $(n).setStep(j + 2);
            });
        },
        //上一个步骤
        prevStep: function () {
            $(this)._searchStep(function (i, j, n, m) {
                $(n).setStep(j);
            });
        },
        //通用节点查找
        _searchStep: function (callback) {
            $(this).each(function (i, n) {
                var $steps = $(n).find(".step-container").find("li");
                $steps.each(function (j, m) {
                    //判断是否为活动步骤
                    if ($(m).attr("class") === "step-step-active") {
                        if (callback) {
                            callback(i, j, n, m);
                        }
                        return false;
                    }
                });
            });
        }
    });
})(jQuery);