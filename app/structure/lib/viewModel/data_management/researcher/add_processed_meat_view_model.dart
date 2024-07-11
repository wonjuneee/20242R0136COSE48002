//
//
// 처리육 <딥에이징> (ViewModel) : Researcher
// 각 입력 단계를 연결한다.
//
//

import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';
import 'package:structure/model/meat_model.dart';
import 'package:structure/components/custom_dialog.dart';

class AddProcessedMeatViewModel with ChangeNotifier {
  bool popup = true;
  void clickedImage(BuildContext context) {
    context.go('/home/data-manage-researcher/add/processed-meat/image');
  }

  void clickedProcessedEval(BuildContext context) {
    context.go('/home/data-manage-researcher/add/processed-meat/eval');
  }

  void clickedHeatedEval(BuildContext context) {
    context.go('/home/data-manage-researcher/add/processed-meat/heated-meat');
  }

  void clickedTongue(BuildContext context) {
    context.go('/home/data-manage-researcher/add/processed-meat/tongue');
  }

  void clickedLab(BuildContext context) {
    context.go('/home/data-manage-researcher/add/processed-meat/lab');
  }

  void clickedbutton(BuildContext context, MeatModel model) {
    popup = model.deepAgedImageCompleted &&
        model.deepAgedFreshCompleted &&
        model.heatedCompleted &&
        model.tongueCompleted &&
        model.labCompleted;
    if (popup == true) {
      showDataCompleteDialog(context, null, () {
        context.go('/home/data-manage-researcher/add');
      });
    } else {
      showDatanotCompleteDialog(context, null, () {
        context.go('/home/data-manage-researcher/add');
      });
    }
  }
}
