import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:structure/components/loading_screen.dart';
import 'package:structure/components/main_button.dart';
import 'package:structure/config/pallete.dart';
import 'package:structure/components/custom_app_bar.dart';
import 'package:structure/components/main_input_field.dart';
import 'package:structure/viewModel/sign_in/password_reset_view_model.dart';

class PasswordResetScreen extends StatelessWidget {
  const PasswordResetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const CustomAppBar(
          title: '비밀번호 재설정', backButton: true, closeButton: false),
      body: Stack(
        children: [
          GestureDetector(
            onTap: () => FocusScope.of(context).unfocus(),
            child: SingleChildScrollView(
              child: Form(
                key: context.read<PasswordResetViewModel>().formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Row(),
                    SizedBox(height: 72.h),
                    // 이메일
                    Container(
                        margin: EdgeInsets.only(left: 40.w),
                        alignment: Alignment.centerLeft,
                        child: Text('이메일', style: Palette.fieldTitle)),
                    SizedBox(height: 8.h),

                    // 이메일 입력 input field
                    MainInputField(
                      mode: 1,
                      width: 640.w,
                      formKey: context.read<PasswordResetViewModel>().formKey,
                      controller: context.read<PasswordResetViewModel>().email,
                      validateFunc: (value) => context
                          .read<PasswordResetViewModel>()
                          .emailValidate(value),
                    ),
                    SizedBox(height: 820.h),

                    // 재설정 버튼
                    MainButton(
                      onPressed:
                          context.read<PasswordResetViewModel>().isValid()
                              ? () async => context
                                  .read<PasswordResetViewModel>()
                                  .sendResetPassword(context)
                              : null,
                      text: '비밀번호 재설정',
                      width: 658.w,
                      height: 96.h,
                      mode: 1,
                    ),
                  ],
                ),
              ),
            ),
          ),
          context.watch<PasswordResetViewModel>().isLoading
              ? const Center(
                  child: LoadingScreen(),
                )
              : Container(),
        ],
      ),
    );
  }
}